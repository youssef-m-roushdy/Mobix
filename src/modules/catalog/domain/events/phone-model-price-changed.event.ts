import { DomainEvent } from '../../../shared/domain/events';

export class PhoneModelPriceChangedEvent extends DomainEvent {
  get eventName(): string {
    return 'catalog.phone-model.price-changed';
  }

  constructor(
    public readonly phoneModelId: string,
    public readonly organizationId: string,
    public readonly oldPriceInCents: number,
    public readonly newPriceInCents: number,
    public readonly currency: string,
  ) {
    super();
  }
}