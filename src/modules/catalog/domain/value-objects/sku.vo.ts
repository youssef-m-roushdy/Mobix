import { ValidationException } from '../../../shared/domain/exceptions';

/**
 * Sku — value object for stock-keeping-unit codes.
 *
 * WHY: Enforces format once. Uniqueness per tenant is a repository concern,
 * not a VO concern.
 */
export class Sku {
  private static readonly PATTERN = /^[A-Z0-9-]{4,32}$/;

  private constructor(public readonly value: string) {}

  static create(raw: string): Sku {
    if (!raw) {
      throw new ValidationException('SKU is required', 'sku');
    }
    const normalized = raw.trim().toUpperCase();
    if (!Sku.PATTERN.test(normalized)) {
      throw new ValidationException(
        'SKU must be 4-32 chars, uppercase letters, digits, and hyphens',
        'sku',
      );
    }
    return new Sku(normalized);
  }

  equals(other: Sku): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}