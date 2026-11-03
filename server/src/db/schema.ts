import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('auth_user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  password: text('password').notNull(),
  lastLogin: text('last_login'),
  isSuperuser: integer('is_superuser', { mode: 'boolean' }).notNull().default(false),
  username: text('username').notNull().unique(),
  lastName: text('last_name').notNull().default(''),
  email: text('email').notNull(),
  isStaff: integer('is_staff', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  dateJoined: text('date_joined').notNull(),
  firstName: text('first_name').notNull().default(''),
});

export const venues = sqliteTable('core_venue', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  city: text('city').notNull(),
  phone: text('phone').notNull(),
  qrCode: text('qr_code').notNull().default(''),
  balance: integer('balance').notNull().default(0),
  userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
});

export const genres = sqliteTable('core_genre', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const tracks = sqliteTable('core_track', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  icon: text('icon').notNull(),
  price: integer('price').notNull(),
  genreId: integer('genre_id').notNull().references(() => genres.id, { onDelete: 'cascade' }),
  venueId: integer('venue_id').notNull().references(() => venues.id, { onDelete: 'cascade' }),
});

export const trackRequests = sqliteTable('core_trackrequest', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userFee: integer('user_fee').notNull(),
  status: text('status', { enum: ['pending', 'accepted', 'rejected'] }).notNull().default('pending'),
  isPaid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  transactionId: text('transaction_id').notNull().default(''),
  paymentToken: text('payment_token').notNull().unique(),
  paymentId: text('payment_id').notNull().default(''),
  trackId: integer('track_id').notNull().references(() => tracks.id, { onDelete: 'cascade' }),
});

export const transactions = sqliteTable('core_transaction', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  amount: integer('amount').notNull(),
  transactionType: text('transaction_type', { enum: ['deposit', 'withdrawal'] }).notNull(),
  createdAt: text('created_at').notNull(),
  trackRequestId: integer('track_request_id').references(() => trackRequests.id, { onDelete: 'set null' }),
  venueId: integer('venue_id').notNull().references(() => venues.id, { onDelete: 'cascade' }),
});

export const withdrawalRequests = sqliteTable('core_withdrawalrequest', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  amount: integer('amount').notNull(),
  status: text('status', { enum: ['pending', 'processing', 'succeeded', 'canceled', 'failed'] }).notNull().default('pending'),
  createdAt: text('created_at').notNull(),
  yookassaPayoutId: text('yookassa_payout_id').notNull().default(''),
  bankCardToken: text('bank_card_token').notNull(),
  fee: integer('fee').notNull().default(0),
  venueId: integer('venue_id').notNull().references(() => venues.id, { onDelete: 'cascade' }),
});
