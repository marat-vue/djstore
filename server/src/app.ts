import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import type { AppConfig } from './config.js';
import type { DatabaseContext } from './db/client.js';
import { HttpError } from './lib/http-error.js';
import { createApiRouter } from './http/routes.js';

export function createApp(database: DatabaseContext, config: AppConfig) {
  const app = express();
  const allowedOrigins = new Set([config.clientUrl]);
  const clientUrl = new URL(config.clientUrl);
  if (clientUrl.hostname === 'localhost' || clientUrl.hostname === '127.0.0.1') {
    for (const hostname of ['localhost', '127.0.0.1']) {
      allowedOrigins.add(`${clientUrl.protocol}//${hostname}${clientUrl.port ? `:${clientUrl.port}` : ''}`);
    }
  }
  app.disable('x-powered-by');
  app.use(cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.has(origin));
    },
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use('/media', express.static(config.mediaRoot));
  app.get('/health/', (_request, response) => response.json({ status: 'ok' }));
  app.use('/api', createApiRouter({ database, config }));
  app.use((_request, response) => response.status(404).json({ detail: 'Не найдено.' }));

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof ZodError) {
      const body: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const field = String(issue.path[0] ?? 'non_field_errors');
        (body[field] ??= []).push(issue.message);
      }
      response.status(400).json(body);
      return;
    }
    if (error instanceof HttpError) {
      response.status(error.status).json(error.body);
      return;
    }
    if (typeof error === 'object' && error && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      response.status(400).json({ detail: 'Запись с таким уникальным значением уже существует.' });
      return;
    }
    console.error(error);
    response.status(500).json({ detail: 'Внутренняя ошибка сервера' });
  };
  app.use(errorHandler);
  return app;
}
