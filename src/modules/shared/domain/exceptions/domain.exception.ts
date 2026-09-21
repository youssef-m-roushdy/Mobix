/**
 * Base class for all domain-level errors.
 *
 * WHY: Separates "the request was malformed" from "the business rule
 * forbids this". The HTTP layer can map these to different status codes.
 */
export abstract class DomainException extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}