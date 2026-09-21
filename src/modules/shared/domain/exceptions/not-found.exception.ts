import { DomainException } from './domain.exception';

/**
 * Thrown when an aggregate is requested but does not exist
 * within the current tenant. Maps to HTTP 404.
 */
export class NotFoundException extends DomainException {
  readonly code = 'NOT_FOUND';

  constructor(public readonly resource: string, public readonly id: string) {
    super(`${resource} ${id} not found`);
  }
}