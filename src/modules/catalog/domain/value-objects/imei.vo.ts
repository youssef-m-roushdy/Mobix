import { ValidationException } from '../../../shared/domain/exceptions';

/**
 * Imei — value object for 15-digit IMEI numbers.
 *
 * WHY: Every physical phone has a unique IMEI. Validates format and the
 * Luhn check digit to catch typos at the boundary.
 */
export class Imei {
  private static readonly PATTERN = /^\d{15}$/;

  private constructor(public readonly value: string) {}

  static create(raw: string): Imei {
    if (!raw) {
      throw new ValidationException('IMEI is required', 'imei');
    }
    const trimmed = raw.trim();
    if (!Imei.PATTERN.test(trimmed)) {
      throw new ValidationException('IMEI must be exactly 15 digits', 'imei');
    }
    if (!Imei.isValidLuhn(trimmed)) {
      throw new ValidationException('IMEI failed Luhn check', 'imei');
    }
    return new Imei(trimmed);
  }

  private static isValidLuhn(digits: string): boolean {
    let sum = 0;
    let doubleNext = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      if (doubleNext) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      doubleNext = !doubleNext;
    }
    return sum % 10 === 0;
  }

  equals(other: Imei): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}