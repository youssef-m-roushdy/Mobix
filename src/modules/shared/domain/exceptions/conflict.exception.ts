import { DomainException } from './domain.exception';

/**
 * Thrown when an operation conflicts with existing state,
 * e.g. duplicate SKU, duplicate IMEI, invalid status transition.
 * Maps to HTTP 409.
 */
export class ConflictException extends DomainException {
  readonly code = 'CONFLICT';

  constructor(message: string, public readonly details?: Record<string, unknown>) {
    super(message);
  }
}