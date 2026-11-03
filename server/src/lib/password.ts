import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

const algorithm = 'pbkdf2_sha256';

export function hashPassword(password: string, iterations = 1_000_000): string {
  const salt = randomBytes(16).toString('base64url').slice(0, 22);
  const digest = pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('base64');
  return `${algorithm}$${iterations}$${salt}$${digest}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [storedAlgorithm, rawIterations, salt, storedDigest] = encoded.split('$');
  const iterations = Number(rawIterations);

  if (storedAlgorithm !== algorithm || !salt || !storedDigest || !Number.isSafeInteger(iterations) || iterations <= 0) {
    return false;
  }

  const actual = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  const expected = Buffer.from(storedDigest, 'base64');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
