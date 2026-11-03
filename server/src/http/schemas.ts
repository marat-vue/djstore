import { z } from 'zod';

const requiredText = (max: number) => z.string().trim().min(1).max(max);

export const idParamsSchema = z.object({
  venueId: z.coerce.number().int().positive(),
});

export const trackParamsSchema = z.object({
  venueId: z.coerce.number().int().positive(),
  trackId: z.coerce.number().int().positive(),
});

export const requestParamsSchema = z.object({
  requestId: z.coerce.number().int().positive(),
});

export const paymentParamsSchema = z.object({
  paymentToken: z.string().uuid(),
});

export const loginSchema = z.object({
  username: requiredText(150),
  password: z.string().min(1),
});

export const registrationSchema = z.object({
  username: requiredText(150).regex(/^[\p{L}\p{N}_@.+-]+$/u),
  password: z.string().min(1).max(128),
  email: z.email().max(254),
  name: requiredText(100),
  city: requiredText(50),
  phone: requiredText(20),
});

export const profilePatchSchema = z.object({
  name: requiredText(100).optional(),
  city: requiredText(50).optional(),
  phone: requiredText(20).optional(),
});

export const genreSchema = z.object({ name: requiredText(100) });

export const tracksQuerySchema = z.object({
  genre: z.coerce.number().int().positive().optional(),
  search: z.string().trim().optional(),
});

const trackFields = {
  title: requiredText(100),
  artist: requiredText(100),
  icon: z.string().max(1000),
  price: z.coerce.number().int().positive(),
  genre_id: z.coerce.number().int().positive().optional(),
  genre: z.coerce.number().int().positive().optional(),
};

export const trackCreateSchema = z.object({
  ...trackFields,
  icon: trackFields.icon.default(''),
}).superRefine((value, context) => {
  if (!value.genre_id && !value.genre) {
    context.addIssue({ code: 'custom', path: ['genre_id'], message: 'Обязательное поле.' });
  }
});

export const trackPatchSchema = z.object({
  title: trackFields.title.optional(),
  artist: trackFields.artist.optional(),
  icon: trackFields.icon.optional(),
  price: trackFields.price.optional(),
  genre_id: trackFields.genre_id,
  genre: trackFields.genre,
});

export const trackRequestCreateSchema = z.object({
  track: z.coerce.number().int().positive(),
  user_fee: z.coerce.number().int().positive(),
});

export const requestStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected']),
});

export const mockPaymentSchema = z.object({ amount: z.coerce.number().positive().optional() });

export const withdrawalSchema = z.object({
  amount: z.coerce.number().int().positive(),
  card_number: z.string().trim().min(1).max(16),
  card_expiry_year: z.string().trim().min(1).max(4),
  card_expiry_month: z.string().trim().min(1).max(2),
  card_csc: z.string().trim().min(1).max(4),
});

export const mockWithdrawalSchema = z.object({ amount: z.coerce.number().int().positive() });

export const webhookSchema = z.object({ object: z.object({ id: z.string().min(1) }) });
