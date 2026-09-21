/**
 * DomainEvent — base class for facts that happened in the domain.
 *
 * WHY: Events are named in past tense, are immutable, and carry
 * just enough data for consumers to react. They decouple side
 * effects (audit, notifications, analytics) from the aggregate.
 */
export abstract class DomainEvent {
  public readonly occurredAt: Date;

  constructor() {
    this.occurredAt = new Date();
  }

  abstract get eventName(): string;
}