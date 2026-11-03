import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import QRCode from 'qrcode';
import { and, desc, eq, inArray, like, or, sql, type SQL } from 'drizzle-orm';
import type { AppConfig } from '../config.js';
import type { DatabaseContext } from '../db/client.js';
import {
  genres,
  trackRequests,
  tracks,
  transactions,
  users,
  venues,
  withdrawalRequests,
} from '../db/schema.js';
import { apiDate, databaseUuid } from '../lib/format.js';
import { HttpError } from '../lib/http-error.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { createTokenPair } from '../lib/tokens.js';
import { YooKassaService } from '../services/yookassa.js';
import { authenticate, requireVenue, type AuthenticatedRequest } from './auth.js';
import {
  genreSchema,
  idParamsSchema,
  loginSchema,
  mockPaymentSchema,
  mockWithdrawalSchema,
  paymentParamsSchema,
  profilePatchSchema,
  registrationSchema,
  requestParamsSchema,
  requestStatusSchema,
  trackCreateSchema,
  trackParamsSchema,
  trackPatchSchema,
  trackRequestCreateSchema,
  tracksQuerySchema,
  webhookSchema,
  withdrawalSchema,
} from './schemas.js';
import { serializeTrack, serializeTrackRequest, serializeVenue, type TrackRequestRow, type TrackRow } from './serializers.js';

interface ApiContext {
  database: DatabaseContext;
  config: AppConfig;
}

const trackColumns = {
  id: tracks.id,
  title: tracks.title,
  icon: tracks.icon,
  artist: tracks.artist,
  price: tracks.price,
  genreId: genres.id,
  genreName: genres.name,
};

const requestColumns = {
  ...trackColumns,
  requestId: trackRequests.id,
  userFee: trackRequests.userFee,
  status: trackRequests.status,
  isPaid: trackRequests.isPaid,
  paymentToken: trackRequests.paymentToken,
  paymentId: trackRequests.paymentId,
  createdAt: trackRequests.createdAt,
};

function findTrack(context: ApiContext, condition: SQL): TrackRow | undefined {
  return context.database.db.select(trackColumns)
    .from(tracks)
    .innerJoin(genres, eq(genres.id, tracks.genreId))
    .where(condition)
    .get();
}

function findTrackRequest(context: ApiContext, condition: SQL): TrackRequestRow | undefined {
  return context.database.db.select(requestColumns)
    .from(trackRequests)
    .innerJoin(tracks, eq(tracks.id, trackRequests.trackId))
    .innerJoin(genres, eq(genres.id, tracks.genreId))
    .where(condition)
    .get();
}

function notFound(message = 'Не найдено.'): never {
  throw new HttpError(404, message);
}

function assertOwnedVenue(request: AuthenticatedRequest, venueId: number): number {
  const authenticatedVenueId = requireVenue(request);
  if (authenticatedVenueId !== venueId) {
    throw new HttpError(403, 'Вы не можете изменять данные другого заведения');
  }
  return authenticatedVenueId;
}

function validateWithdrawalAmount(amount: number, config: AppConfig): void {
  if (amount < config.minWithdrawalAmount) {
    throw new HttpError(400, `Минимальная сумма вывода: ${config.minWithdrawalAmount} руб.`);
  }
}

export function createApiRouter(context: ApiContext): Router {
  const router = Router();
  const auth = authenticate(context.database, context.config);
  const yookassa = new YooKassaService(context.config);

  router.post('/token/', (request, response) => {
    const input = loginSchema.parse(request.body);
    const user = context.database.db.select({
      id: users.id,
      password: users.password,
      isActive: users.isActive,
      venueId: venues.id,
    }).from(users).leftJoin(venues, eq(venues.userId, users.id)).where(eq(users.username, input.username)).get();

    if (!user?.isActive || !verifyPassword(input.password, user.password)) {
      throw new HttpError(401, 'No active account found with the given credentials');
    }

    response.json(createTokenPair(user.id, user.venueId ?? undefined, context.config.jwtSecret));
  });

  router.post('/register/', async (request, response) => {
    const input = registrationSchema.parse(request.body);
    const now = new Date().toISOString();
    const created = context.database.db.transaction((tx) => {
      const user = tx.insert(users).values({
        username: input.username,
        password: hashPassword(input.password, context.config.passwordIterations),
        email: input.email,
        dateJoined: now,
        firstName: '',
        lastName: '',
        isActive: true,
        isStaff: false,
        isSuperuser: false,
      }).returning({ id: users.id, username: users.username, email: users.email }).get();

      const venue = tx.insert(venues).values({
        userId: user.id,
        name: input.name,
        city: input.city,
        phone: input.phone,
        qrCode: '',
        balance: 0,
      }).returning().get();
      return { user, venue };
    });

    const qrRelativePath = `qr_codes/qr_${created.venue.id}.png`;
    try {
      await fs.mkdir(path.join(context.config.mediaRoot, 'qr_codes'), { recursive: true });
      await QRCode.toFile(
        path.join(context.config.mediaRoot, qrRelativePath),
        `${context.config.clientUrl}/venue/${created.venue.id}/request`,
      );
      context.database.db.update(venues).set({ qrCode: qrRelativePath }).where(eq(venues.id, created.venue.id)).run();
    } catch (error) {
      context.database.db.transaction((tx) => {
        tx.delete(venues).where(eq(venues.id, created.venue.id)).run();
        tx.delete(users).where(eq(users.id, created.user.id)).run();
      });
      throw error;
    }

    response.status(201).json({
      username: created.user.username,
      email: created.user.email,
      name: created.venue.name,
      city: created.venue.city,
      phone: created.venue.phone,
    });
  });

  router.get('/profile/', auth, (request, response) => {
    const venueId = requireVenue(request as AuthenticatedRequest);
    const venue = context.database.db.select().from(venues).where(eq(venues.id, venueId)).get();
    if (!venue) notFound('Профиль заведения не найден');
    response.json(serializeVenue(venue, context.config.domain));
  });

  router.patch('/profile/', auth, (request, response) => {
    const venueId = requireVenue(request as AuthenticatedRequest);
    const input = profilePatchSchema.parse(request.body);
    const venue = context.database.db.update(venues).set(input).where(eq(venues.id, venueId)).returning().get();
    if (!venue) notFound('Профиль заведения не найден');
    response.json(serializeVenue(venue, context.config.domain));
  });

  router.get('/genres/', auth, (_request, response) => {
    response.json(context.database.db.select().from(genres).all());
  });

  router.post('/genres/', auth, (request, response) => {
    const input = genreSchema.parse(request.body);
    const genre = context.database.db.insert(genres).values(input).returning().get();
    response.status(201).json(genre);
  });

  router.get('/venue/:venueId/tracks/', (request, response) => {
    const { venueId } = idParamsSchema.parse(request.params);
    const query = tracksQuerySchema.parse(request.query);
    const conditions: SQL[] = [eq(tracks.venueId, venueId)];
    if (query.genre) conditions.push(eq(tracks.genreId, query.genre));
    if (query.search) {
      const pattern = `%${query.search.toLowerCase()}%`;
      conditions.push(or(
        like(sql`lower(${tracks.title})`, pattern),
        like(sql`lower(${tracks.artist})`, pattern),
      )!);
    }
    const rows = context.database.db.select(trackColumns)
      .from(tracks)
      .innerJoin(genres, eq(genres.id, tracks.genreId))
      .where(and(...conditions))
      .all();
    response.json(rows.map(serializeTrack));
  });

  router.post('/venue/:venueId/tracks/', auth, (request, response) => {
    const { venueId } = idParamsSchema.parse(request.params);
    assertOwnedVenue(request as AuthenticatedRequest, venueId);
    const input = trackCreateSchema.parse(request.body);
    const genreId = input.genre_id ?? input.genre!;
    if (!context.database.db.select({ id: genres.id }).from(genres).where(eq(genres.id, genreId)).get()) {
      throw new HttpError(400, 'Указанный жанр не найден', { genre_id: ['Недопустимый первичный ключ.'] });
    }
    const inserted = context.database.db.insert(tracks).values({
      venueId,
      genreId,
      title: input.title,
      artist: input.artist,
      icon: input.icon,
      price: input.price,
    }).returning({ id: tracks.id }).get();
    const track = findTrack(context, eq(tracks.id, inserted.id));
    response.status(201).json(serializeTrack(track!));
  });

  router.get('/venue/:venueId/tracks/:trackId/', auth, (request, response) => {
    const { venueId, trackId } = trackParamsSchema.parse(request.params);
    assertOwnedVenue(request as AuthenticatedRequest, venueId);
    const track = findTrack(context, and(eq(tracks.id, trackId), eq(tracks.venueId, venueId))!);
    if (!track) notFound('Трек не найден');
    response.json(serializeTrack(track));
  });

  router.patch('/venue/:venueId/tracks/:trackId/', auth, (request, response) => {
    const { venueId, trackId } = trackParamsSchema.parse(request.params);
    assertOwnedVenue(request as AuthenticatedRequest, venueId);
    const input = trackPatchSchema.parse(request.body);
    if (!context.database.db.select({ id: tracks.id }).from(tracks).where(and(eq(tracks.id, trackId), eq(tracks.venueId, venueId))).get()) {
      notFound('Трек не найден');
    }
    const genreId = input.genre_id ?? input.genre;
    if (genreId && !context.database.db.select({ id: genres.id }).from(genres).where(eq(genres.id, genreId)).get()) {
      throw new HttpError(400, 'Указанный жанр не найден', { genre_id: ['Недопустимый первичный ключ.'] });
    }
    context.database.db.update(tracks).set({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.artist !== undefined ? { artist: input.artist } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(genreId !== undefined ? { genreId } : {}),
    }).where(eq(tracks.id, trackId)).run();
    response.json(serializeTrack(findTrack(context, eq(tracks.id, trackId))!));
  });

  router.delete('/venue/:venueId/tracks/:trackId/', auth, (request, response) => {
    const { venueId, trackId } = trackParamsSchema.parse(request.params);
    assertOwnedVenue(request as AuthenticatedRequest, venueId);
    if (!context.database.db.select({ id: tracks.id }).from(tracks).where(and(eq(tracks.id, trackId), eq(tracks.venueId, venueId))).get()) {
      notFound('Трек не найден');
    }
    context.database.db.transaction((tx) => {
      const requestIds = tx.select({ id: trackRequests.id }).from(trackRequests).where(eq(trackRequests.trackId, trackId)).all().map(({ id }) => id);
      if (requestIds.length) {
        tx.update(transactions).set({ trackRequestId: null }).where(inArray(transactions.trackRequestId, requestIds)).run();
        tx.delete(trackRequests).where(inArray(trackRequests.id, requestIds)).run();
      }
      tx.delete(tracks).where(eq(tracks.id, trackId)).run();
    });
    response.status(204).send();
  });

  router.post('/venue/:venueId/request/', (request, response) => {
    const { venueId } = idParamsSchema.parse(request.params);
    const input = trackRequestCreateSchema.parse(request.body);
    const track = context.database.db.select({ id: tracks.id, price: tracks.price }).from(tracks)
      .where(and(eq(tracks.id, input.track), eq(tracks.venueId, venueId))).get();
    if (!track) {
      throw new HttpError(400, 'Указанный трек не добавлен в данное заведение', { user_fee: ['Указанный трек не добавлен в данное заведение'] });
    }
    if (input.user_fee < track.price) {
      throw new HttpError(400, `Сумма должна быть не меньше ${track.price}`, { user_fee: [`Сумма должна быть не меньше ${track.price}`] });
    }
    const inserted = context.database.db.insert(trackRequests).values({
      trackId: track.id,
      userFee: input.user_fee,
      status: 'pending',
      isPaid: false,
      createdAt: new Date().toISOString(),
      transactionId: '',
      paymentToken: randomUUID().replaceAll('-', ''),
      paymentId: '',
    }).returning({ id: trackRequests.id }).get();
    const result = findTrackRequest(context, eq(trackRequests.id, inserted.id));
    response.status(201).json(serializeTrackRequest(result!, context.config.domain));
  });

  router.get('/requests/pay/:paymentToken/', (request, response) => {
    const { paymentToken } = paymentParamsSchema.parse(request.params);
    const result = findTrackRequest(context, eq(trackRequests.paymentToken, databaseUuid(paymentToken)));
    if (!result) notFound('Запрос на трек не найден');
    response.json(serializeTrackRequest(result, context.config.domain));
  });

  router.post('/requests/pay/:paymentToken/', (request, response) => {
    const { paymentToken } = paymentParamsSchema.parse(request.params);
    mockPaymentSchema.parse(request.body);
    const storedToken = databaseUuid(paymentToken);
    const trackRequest = context.database.db.select().from(trackRequests).where(eq(trackRequests.paymentToken, storedToken)).get();
    if (!trackRequest) notFound('Запрос на трек не найден');
    if (trackRequest.isPaid) {
      throw new HttpError(400, 'Запрос уже оплачен');
    }
    context.database.db.update(trackRequests).set({ isPaid: true }).where(eq(trackRequests.id, trackRequest.id)).run();
    response.json({ detail: 'Оплата успешно подтверждена' });
  });

  router.get('/requests/', auth, (request, response) => {
    const venueId = requireVenue(request as AuthenticatedRequest);
    const rows = context.database.db.select(requestColumns)
      .from(trackRequests)
      .innerJoin(tracks, eq(tracks.id, trackRequests.trackId))
      .innerJoin(genres, eq(genres.id, tracks.genreId))
      .where(eq(tracks.venueId, venueId))
      .orderBy(desc(trackRequests.createdAt))
      .all();
    response.json(rows.map((row) => serializeTrackRequest(row, context.config.domain)));
  });

  router.patch('/requests/:requestId/', auth, (request, response) => {
    const { requestId } = requestParamsSchema.parse(request.params);
    const { status } = requestStatusSchema.parse(request.body);
    const venueId = requireVenue(request as AuthenticatedRequest);
    const current = findTrackRequest(context, and(eq(trackRequests.id, requestId), eq(tracks.venueId, venueId))!);
    if (!current) notFound('Запрос на трек не найден');
    if (current.status !== 'pending') {
      throw new HttpError(400, 'Можно изменять только ожидающие запросы');
    }
    if (status === 'accepted' && !current.isPaid) {
      throw new HttpError(400, 'Запрос должен быть оплачен перед принятием');
    }

    context.database.db.transaction((tx) => {
      tx.update(trackRequests).set({ status }).where(eq(trackRequests.id, requestId)).run();
      if (status === 'accepted') {
        const priorDeposit = tx.select({ id: transactions.id }).from(transactions).where(and(
          eq(transactions.trackRequestId, requestId),
          eq(transactions.transactionType, 'deposit'),
        )).get();
        if (!priorDeposit) {
          tx.update(venues).set({ balance: sql`${venues.balance} + ${current.userFee}` }).where(eq(venues.id, venueId)).run();
          tx.insert(transactions).values({
            venueId,
            amount: current.userFee,
            transactionType: 'deposit',
            trackRequestId: requestId,
            createdAt: new Date().toISOString(),
          }).run();
        }
      }
    });
    response.json(serializeTrackRequest(findTrackRequest(context, eq(trackRequests.id, requestId))!, context.config.domain));
  });

  router.get('/transactions/', auth, (request, response) => {
    const venueId = requireVenue(request as AuthenticatedRequest);
    const rows = context.database.db.select().from(transactions)
      .where(eq(transactions.venueId, venueId)).orderBy(desc(transactions.createdAt)).all();
    response.json(rows.map((row) => ({
      id: row.id,
      amount: row.amount,
      transaction_type: row.transactionType,
      created_at: apiDate(row.createdAt),
    })));
  });

  router.get('/withdrawals/history/', auth, (request, response) => {
    const venueId = requireVenue(request as AuthenticatedRequest);
    const rows = context.database.db.select().from(withdrawalRequests)
      .where(eq(withdrawalRequests.venueId, venueId)).orderBy(desc(withdrawalRequests.createdAt)).all();
    response.json(rows.map((row) => ({
      id: row.id,
      amount: row.amount,
      bank_card_token: row.bankCardToken,
      fee: row.fee,
      status: row.status,
      yookassa_payout_id: row.yookassaPayoutId,
      created_at: apiDate(row.createdAt),
    })));
  });

  router.post('/mock-withdraw/', auth, (request, response) => {
    const { amount } = mockWithdrawalSchema.parse(request.body);
    validateWithdrawalAmount(amount, context.config);
    const venueId = requireVenue(request as AuthenticatedRequest);
    const fee = Math.trunc(amount * context.config.withdrawalFeePercent);
    const result = context.database.db.transaction((tx) => {
      const venue = tx.select().from(venues).where(eq(venues.id, venueId)).get();
      if (!venue || venue.balance < amount) {
        throw new HttpError(400, 'Недостаточно средств на балансе');
      }
      const withdrawal = tx.insert(withdrawalRequests).values({
        venueId,
        amount,
        bankCardToken: 'mock_card_token',
        fee,
        yookassaPayoutId: `mock_payout_${randomUUID()}`,
        status: 'succeeded',
        createdAt: new Date().toISOString(),
      }).returning({ id: withdrawalRequests.id }).get();
      tx.update(venues).set({ balance: sql`${venues.balance} - ${amount}` }).where(eq(venues.id, venueId)).run();
      tx.insert(transactions).values({
        venueId,
        amount: -amount,
        transactionType: 'withdrawal',
        trackRequestId: null,
        createdAt: new Date().toISOString(),
      }).run();
      return withdrawal;
    });
    response.status(201).json({ id: result.id, amount, fee, status: 'succeeded' });
  });

  router.post('/withdrawals/', auth, async (request, response) => {
    const input = withdrawalSchema.parse(request.body);
    validateWithdrawalAmount(input.amount, context.config);
    const venueId = requireVenue(request as AuthenticatedRequest);
    const venue = context.database.db.select().from(venues).where(eq(venues.id, venueId)).get();
    if (!venue || venue.balance < input.amount) {
      throw new HttpError(400, 'Недостаточно средств на балансе');
    }
    const fee = Math.trunc(input.amount * context.config.withdrawalFeePercent);
    const payout = await yookassa.createPayout(input.amount, fee, input.card_number);
    const result = context.database.db.transaction((tx) => {
      const currentVenue = tx.select().from(venues).where(eq(venues.id, venueId)).get();
      if (!currentVenue || currentVenue.balance < input.amount) {
        throw new HttpError(409, 'Баланс изменился, повторите операцию');
      }
      const withdrawal = tx.insert(withdrawalRequests).values({
        venueId,
        amount: input.amount,
        bankCardToken: `card_****${input.card_number.slice(-4)}`,
        fee,
        yookassaPayoutId: payout.id,
        status: 'processing',
        createdAt: new Date().toISOString(),
      }).returning().get();
      tx.update(venues).set({ balance: sql`${venues.balance} - ${input.amount}` }).where(eq(venues.id, venueId)).run();
      tx.insert(transactions).values({
        venueId,
        amount: -input.amount,
        transactionType: 'withdrawal',
        trackRequestId: null,
        createdAt: new Date().toISOString(),
      }).run();
      return withdrawal;
    });
    response.status(201).json({
      amount: result.amount,
      status: result.status,
      created_at: apiDate(result.createdAt),
      fee: result.fee,
    });
  });

  router.post('/payment/:paymentToken/', auth, async (request, response) => {
    const { paymentToken } = paymentParamsSchema.parse(request.params);
    const venueId = requireVenue(request as AuthenticatedRequest);
    const trackRequest = findTrackRequest(context, and(
      eq(trackRequests.paymentToken, databaseUuid(paymentToken)),
      eq(tracks.venueId, venueId),
    )!);
    if (!trackRequest) notFound('Запрос на трек не найден');
    const payment = await yookassa.createPayment(
      trackRequest.userFee,
      paymentToken,
      `Оплата трека ${trackRequest.title}`,
    );
    context.database.db.update(trackRequests).set({ paymentId: payment.id }).where(eq(trackRequests.id, trackRequest.requestId)).run();
    response.status(201).json({ confirmation_url: payment.confirmation?.confirmation_url });
  });

  router.post('/payment-webhook/', async (request, response) => {
    const event = webhookSchema.parse(request.body);
    const payment = await yookassa.getPayment(event.object.id);
    if (payment.status === 'succeeded' && payment.metadata?.payment_token) {
      const storedToken = databaseUuid(payment.metadata.payment_token);
      context.database.db.transaction((tx) => {
        const current = tx.select({
          requestId: trackRequests.id,
          isPaid: trackRequests.isPaid,
          amount: trackRequests.userFee,
          venueId: tracks.venueId,
        }).from(trackRequests).innerJoin(tracks, eq(tracks.id, trackRequests.trackId))
          .where(eq(trackRequests.paymentToken, storedToken)).get();
        if (!current || current.isPaid) return;
        tx.update(trackRequests).set({ isPaid: true, transactionId: payment.id }).where(eq(trackRequests.id, current.requestId)).run();
        tx.update(venues).set({ balance: sql`${venues.balance} + ${current.amount}` }).where(eq(venues.id, current.venueId)).run();
        tx.insert(transactions).values({
          venueId: current.venueId,
          amount: current.amount,
          transactionType: 'deposit',
          trackRequestId: current.requestId,
          createdAt: new Date().toISOString(),
        }).run();
      });
    }
    response.status(200).send();
  });

  router.post('/withdrawal-webhook/', async (request, response) => {
    const event = webhookSchema.parse(request.body);
    const payout = await yookassa.getPayout(event.object.id);
    context.database.db.transaction((tx) => {
      const withdrawal = tx.select().from(withdrawalRequests)
        .where(eq(withdrawalRequests.yookassaPayoutId, payout.id)).get();
      if (!withdrawal) return;
      const status = ['pending', 'processing', 'succeeded', 'canceled', 'failed'].includes(payout.status)
        ? payout.status as 'pending' | 'processing' | 'succeeded' | 'canceled' | 'failed'
        : 'failed';
      if (status === 'canceled' && withdrawal.status !== 'canceled') {
        tx.update(venues).set({ balance: sql`${venues.balance} + ${withdrawal.amount}` }).where(eq(venues.id, withdrawal.venueId)).run();
      }
      tx.update(withdrawalRequests).set({ status }).where(eq(withdrawalRequests.id, withdrawal.id)).run();
    });
    response.status(200).send();
  });

  return router;
}
