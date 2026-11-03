import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { eq } from 'drizzle-orm';
import type { AppConfig } from '../config.js';
import type { DatabaseContext } from '../db/client.js';
import { users, venues } from '../db/schema.js';
import { HttpError } from '../lib/http-error.js';
import { verifyAccessToken } from '../lib/tokens.js';

export interface AuthContext {
  userId: number;
  venueId?: number;
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
}

export function authenticate(database: DatabaseContext, config: AppConfig): RequestHandler {
  return (request: Request, response: Response, next: NextFunction) => {
    const header = request.header('authorization');
    if (!header?.startsWith('Bearer ')) {
      response.status(401).json({ detail: 'Учетные данные не были предоставлены.' });
      return;
    }

    try {
      const claims = verifyAccessToken(header.slice(7), config.jwtSecret);
      const user = database.db.select({
        id: users.id,
        isActive: users.isActive,
        venueId: venues.id,
      }).from(users).leftJoin(venues, eq(venues.userId, users.id)).where(eq(users.id, claims.user_id)).get();

      if (!user?.isActive) {
        throw new Error('Inactive user');
      }

      (request as AuthenticatedRequest).auth = { userId: user.id, venueId: user.venueId ?? undefined };
      next();
    } catch {
      response.status(401).json({ detail: 'Токен недействителен или просрочен.', code: 'token_not_valid' });
    }
  };
}

export function requireVenue(request: AuthenticatedRequest): number {
  if (!request.auth?.venueId) {
    throw new HttpError(404, 'Профиль заведения не найден');
  }
  return request.auth.venueId;
}
