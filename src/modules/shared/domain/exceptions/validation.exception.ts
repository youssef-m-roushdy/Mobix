import { DomainException } from './domain.exception';

/**
 * Thrown when a value violates a format or range rule.
 * Maps to HTTP 400.
 */
export class ValidationException extends DomainException {
  readonly code = 'VALIDATION_ERROR';

  constructor(message: string, public readonly field?: string) {
    super(message);
  }
}