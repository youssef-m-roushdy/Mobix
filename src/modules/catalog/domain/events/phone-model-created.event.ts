import { DomainEvent } from '../../../shared/domain/events';

export class PhoneModelCreatedEvent extends DomainEvent {
  get eventName(): string {
    return 'catalog.phone-model.created';
  }

  constructor(
    public readonly phoneModelId: string,
    public readonly organizationId: string,
    public readonly sku: string,
    public readonly brand: string,
    public readonly modelName: string,
  ) {
    super();
  }
}