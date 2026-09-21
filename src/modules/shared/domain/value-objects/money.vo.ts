import {
  ValidationException,
  ConflictException,
} from '../../../shared/domain/exceptions';

/**
 * Money — value object for monetary amounts.
 *
 * WHY: Prevents floating-point drift in prices and enforces currency safety.
 * Stores amounts as integer cents internally; validates on creation.
 * Immutable: to change a price, create a new Money.
 */
export class Money {
  private constructor(
    public readonly amountInCents: number,
    public readonly currency: string,
  ) {}

  static fromDecimal(amount: number, currency: string): Money {
    if (!Number.isFinite(amount)) {
      throw new ValidationException('Amount must be finite', 'amount');
    }
    if (amount < 0) {
      throw new ValidationException('Amount cannot be negative', 'amount');
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new ValidationException('Currency must be ISO 4217 (e.g. USD)', 'currency');
    }
    return new Money(Math.round(amount * 100), currency);
  }

  static fromCents(cents: number, currency: string): Money {
    if (!Number.isInteger(cents)) {
      throw new ValidationException('Cents must be an integer', 'cents');
    }
    if (cents < 0) {
      throw new ValidationException('Amount cannot be negative', 'cents');
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new ValidationException('Currency must be ISO 4217 (e.g. USD)', 'currency');
    }
    return new Money(cents, currency);
  }

  toDecimal(): number {
    return this.amountInCents / 100;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new ConflictException(
        `Cannot add ${other.currency} to ${this.currency}`,
        { from: this.currency, to: other.currency },
      );
    }
    return new Money(this.amountInCents + other.amountInCents, this.currency);
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor) || factor < 0) {
      throw new ValidationException('Factor must be non-negative finite', 'factor');
    }
    return new Money(Math.round(this.amountInCents * factor), this.currency);
  }

  equals(other: Money): boolean {
    return (
      this.amountInCents === other.amountInCents &&
      this.currency === other.currency
    );
  }

  toString(): string {
    return `${this.toDecimal().toFixed(2)} ${this.currency}`;
  }
}