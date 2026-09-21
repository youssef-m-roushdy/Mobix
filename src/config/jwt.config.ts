import type { JwtSignOptions } from '@nestjs/jwt';

/**
 * Centralizes JWT configuration so every sign() call uses the same
 * issuer, audience, secret, and expiry. If any of these change, they
 * change here and nowhere else.
 */

function getIssuer(): string {
  return process.env.JWT_ISSUER ?? 'mobix';
}

function getAudience(): string {
  return process.env.JWT_AUDIENCE ?? 'mobix-api';
}

export function getJwtAccessOptions(): JwtSignOptions {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined');
  }

  const rawExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';

  return {
    secret,
    expiresIn: rawExpiresIn as JwtSignOptions['expiresIn'],
    issuer: getIssuer(),
    audience: getAudience(),
  };
}

export function getJwtRefreshOptions(): JwtSignOptions {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  const rawExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

  return {
    secret,
    expiresIn: rawExpiresIn as JwtSignOptions['expiresIn'],
    issuer: getIssuer(),
    audience: getAudience(),
  };
}