import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { AppConfig } from '../src/config.js';
import { createDatabase, type DatabaseContext } from '../src/db/client.js';
import { migrateDatabase } from '../src/db/migrate.js';
import { createApp } from '../src/app.js';
import { verifyPassword } from '../src/lib/password.js';

describe('DJ Store API', () => {
  let tempDirectory: string;
  let database: DatabaseContext;
  let config: AppConfig;

  beforeEach(() => {
    tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'djstore-api-'));
    config = {
      port: 8000,
      databaseUrl: path.join(tempDirectory, 'test.sqlite3'),
      jwtSecret: 'test-secret',
      domain: 'http://localhost:8000',
      clientUrl: 'http://localhost:3000',
      mediaRoot: path.join(tempDirectory, 'media'),
      yookassaShopId: '',
      yookassaSecretKey: '',
      minWithdrawalAmount: 500,
      withdrawalFeePercent: 0.05,
      passwordIterations: 1_000,
    };
    database = createDatabase(config.databaseUrl);
    migrateDatabase(database);
  });

  afterEach(() => {
    database.sqlite.close();
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  });

  it('keeps compatibility with Django PBKDF2 password hashes', () => {
    const legacyAdminHash = 'pbkdf2_sha256$1000000$O84mYHRZNqPKU9rYJw1W5j$nK1NwPIQWRzftZ89nTX7ih400H4YQ/wJ66kd1M8TKKQ=';
    expect(verifyPassword('admin', legacyAdminHash)).toBe(true);
    expect(verifyPassword('wrong', legacyAdminHash)).toBe(false);
  });

  it('supports the complete client workflow', async () => {
    const app = createApp(database, config);
    const registration = await request(app).post('/api/register/').send({
      username: 'testvenue',
      password: 'testpass123',
      email: 'test@example.com',
      name: 'Test Club',
      city: 'Москва',
      phone: '+79123456789',
    });
    expect(registration.status).toBe(201);
    expect(registration.body).toMatchObject({ username: 'testvenue', name: 'Test Club' });
    expect(fs.existsSync(path.join(config.mediaRoot, 'qr_codes', 'qr_1.png'))).toBe(true);

    const login = await request(app).post('/api/token/').send({ username: 'testvenue', password: 'testpass123' });
    expect(login.status).toBe(200);
    expect(login.body.access).toEqual(expect.any(String));
    expect(login.body.refresh).toEqual(expect.any(String));
    const auth = { Authorization: `Bearer ${login.body.access}` };

    const profile = await request(app).get('/api/profile/').set(auth);
    expect(profile.status).toBe(200);
    expect(profile.body).toMatchObject({
      id: 1,
      balance: 0,
      qr_code: 'http://localhost:8000/media/qr_codes/qr_1.png',
    });

    const genre = await request(app).post('/api/genres/').set(auth).send({ name: 'House' });
    expect(genre.status).toBe(201);

    const createdTrack = await request(app).post('/api/venue/1/tracks/').set(auth).send({
      title: 'One More Time',
      artist: 'Daft Punk',
      icon: 'https://example.com/cover.png',
      price: 100,
      genre_id: genre.body.id,
    });
    expect(createdTrack.status).toBe(201);
    expect(createdTrack.body.genre.name).toBe('House');

    const publicTracks = await request(app).get('/api/venue/1/tracks/').query({ search: 'daft', genre: genre.body.id });
    expect(publicTracks.status).toBe(200);
    expect(publicTracks.body).toHaveLength(1);

    const tooCheap = await request(app).post('/api/venue/1/request/').send({
      track: createdTrack.body.id,
      user_fee: 99,
    });
    expect(tooCheap.status).toBe(400);
    expect(tooCheap.body.user_fee[0]).toContain('100');

    const createdRequest = await request(app).post('/api/venue/1/request/').send({
      track: createdTrack.body.id,
      user_fee: 600,
    });
    expect(createdRequest.status).toBe(201);
    expect(createdRequest.body).toMatchObject({ is_paid: false, status: 'pending', min_fee: 100 });

    const payment = await request(app)
      .post(`/api/requests/pay/${createdRequest.body.payment_token}/`)
      .send({ amount: 600 });
    expect(payment.status).toBe(200);

    const accepted = await request(app)
      .patch(`/api/requests/${createdRequest.body.id}/`)
      .set(auth)
      .send({ status: 'accepted' });
    expect(accepted.status).toBe(200);
    expect(accepted.body.status).toBe('accepted');

    const creditedProfile = await request(app).get('/api/profile/').set(auth);
    expect(creditedProfile.body.balance).toBe(600);

    const withdrawal = await request(app).post('/api/mock-withdraw/').set(auth).send({ amount: 500 });
    expect(withdrawal.status).toBe(201);
    expect(withdrawal.body).toMatchObject({ amount: 500, fee: 25, status: 'succeeded' });

    const transactions = await request(app).get('/api/transactions/').set(auth);
    expect(transactions.status).toBe(200);
    expect(transactions.body).toHaveLength(2);
    expect(transactions.body[0]).toHaveProperty('id');

    const finalProfile = await request(app).get('/api/profile/').set(auth);
    expect(finalProfile.body.balance).toBe(100);
  });

  it('protects private routes and reports duplicate usernames', async () => {
    const app = createApp(database, config);
    expect((await request(app).get('/api/profile/')).status).toBe(401);

    const body = {
      username: 'same', password: 'secret', email: 'one@example.com',
      name: 'One', city: 'City', phone: '+70000000000',
    };
    expect((await request(app).post('/api/register/').send(body)).status).toBe(201);
    expect((await request(app).post('/api/register/').send(body)).status).toBe(400);
  });
});
