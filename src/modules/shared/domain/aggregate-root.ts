import { DomainEvent } from './events/domain-event';

/**
 * AggregateRoot — base for entities that record domain events.
 *
 * WHY: The aggregate records events internally. The repository or
 * application layer pulls them after save and dispatches them.
 * The entity never knows who listens.
 */
export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}