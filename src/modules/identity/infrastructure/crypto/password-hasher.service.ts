import { Injectable } from '@nestjs/common';
import * as argon2 from '@node-rs/argon2';

/**
 * PasswordHasher — centralized Argon2id configuration.
 *
 * WHY: Hashing parameters must be explicit, not library defaults.
 * If a future library version changes defaults, security silently degrades.
 * This is the single source of truth for how passwords are hashed.
 *
 * NOTE: Argon2id is @node-rs/argon2's default algorithm, so we omit
 * the `algorithm` field. Passing `argon2.Algorithm.Argon2id` directly
 * triggers a const-enum error under `isolatedModules`.
 */
@Injectable()
export class PasswordHasher {
  // OWASP 2026 baseline for Argon2id:
  //   m = 19456 KiB (19 MiB)
  //   t = 2 iterations
  //   p = 1 parallelism
  // Target: 100-300ms per hash on production hardware.
  private readonly options: argon2.Options = {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  };

  private readonly pepper = process.env.PASSWORD_PEPPER ?? '';

  async hash(password: string): Promise<string> {
    return argon2.hash(password + this.pepper, this.options);
  }

  async verify(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password + this.pepper);
    } catch {
      // Malformed hash → treat as invalid, don't leak why
      return false;
    }
  }

  /**
   * Burns the same amount of time as a real hash. Used in login when
   * the user doesn't exist, so the response time doesn't reveal
   * whether the email is registered.
   */
  async burnTime(): Promise<void> {
    await this.hash('dummy-password-' + Date.now());
  }
}