import { randomUUID } from 'node:crypto';
import jwt, { type JwtPayload } from 'jsonwebtoken';

interface TokenClaims extends JwtPayload {
  token_type: 'access' | 'refresh';
  user_id: number;
  venue_id?: number;
}

export function createTokenPair(userId: number, venueId: number | undefined, secret: string) {
  const common = { user_id: userId, ...(venueId ? { venue_id: venueId } : {}) };

  return {
    refresh: jwt.sign({ ...common, token_type: 'refresh', jti: randomUUID().replaceAll('-', '') }, secret, {
      algorithm: 'HS256',
      expiresIn: 60 * 60 * 24 * 30,
    }),
    access: jwt.sign({ ...common, token_type: 'access', jti: randomUUID().replaceAll('-', '') }, secret, {
      algorithm: 'HS256',
      expiresIn: 60 * 60 * 24 * 30,
    }),
  };
}

export function verifyAccessToken(token: string, secret: string): TokenClaims {
  const claims = jwt.verify(token, secret, { algorithms: ['HS256'] }) as TokenClaims;
  if (claims.token_type !== 'access' || !Number.isInteger(claims.user_id)) {
    throw new Error('Invalid access token');
  }
  return claims;
}
