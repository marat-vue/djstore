import 'dotenv/config';
import path from 'node:path';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535).default(8000),
  DATABASE_URL: z.string().min(1).default('./db.sqlite3'),
  JWT_SECRET: z.string().min(1).default('development-secret-change-me'),
  DOMAIN: z.string().url().default('http://localhost:8000'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  MEDIA_ROOT: z.string().min(1).default('./media'),
  YOOKASSA_SHOP_ID: z.string().default(''),
  YOOKASSA_SECRET_KEY: z.string().default(''),
  MIN_WITHDRAWAL_AMOUNT: z.coerce.number().int().positive().default(500),
  WITHDRAWAL_FEE_PERCENT: z.coerce.number().min(0).max(1).default(0.05),
  PASSWORD_ITERATIONS: z.coerce.number().int().positive().default(1_000_000),
});

export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  domain: string;
  clientUrl: string;
  mediaRoot: string;
  yookassaShopId: string;
  yookassaSecretKey: string;
  minWithdrawalAmount: number;
  withdrawalFeePercent: number;
  passwordIterations: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.parse(env);

  return {
    port: parsed.PORT,
    databaseUrl: path.resolve(parsed.DATABASE_URL),
    jwtSecret: parsed.JWT_SECRET,
    domain: parsed.DOMAIN.replace(/\/$/, ''),
    clientUrl: parsed.CLIENT_URL.replace(/\/$/, ''),
    mediaRoot: path.resolve(parsed.MEDIA_ROOT),
    yookassaShopId: parsed.YOOKASSA_SHOP_ID,
    yookassaSecretKey: parsed.YOOKASSA_SECRET_KEY,
    minWithdrawalAmount: parsed.MIN_WITHDRAWAL_AMOUNT,
    withdrawalFeePercent: parsed.WITHDRAWAL_FEE_PERCENT,
    passwordIterations: parsed.PASSWORD_ITERATIONS,
  };
}
