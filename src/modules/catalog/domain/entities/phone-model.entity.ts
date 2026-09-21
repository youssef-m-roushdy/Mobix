import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { ValidationException } from '../../../shared/domain/exceptions';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { Sku } from '../value-objects/sku.vo';
import { PhoneModelCreatedEvent } from '../events/phone-model-created.event';
import { PhoneModelPriceChangedEvent } from '../events/phone-model-price-changed.event';

/**
 * PhoneModel — aggregate root for a product definition.
 *
 * WHY: Represents "what a model is" (iPhone 15 Pro 256GB Black),
 * independent of any physical unit. Owns the invariants:
 * brand required, name required, price > 0.
 */
export interface PhoneModelProps {
  id: string;
  organizationId: string;
  brand: string;
  modelName: string;
  storage: string | null;
  color: string | null;
  sku: Sku;
  basePrice: Money;
  createdAt: Date;
  updatedAt: Date;
}

export class PhoneModel extends AggregateRoot {
  private constructor(private props: PhoneModelProps) {
    super();
  }

  static create(input: {
    organizationId: string;
    brand: string;
    modelName: string;
    storage: string | null;
    color: string | null;
    sku: Sku;
    basePrice: Money;
  }): PhoneModel {
    if (!input.organizationId) {
      throw new ValidationException('organizationId is required', 'organizationId');
    }
    if (!input.brand || input.brand.trim().length < 2) {
      throw new ValidationException('Brand must be at least 2 characters', 'brand');
    }
    if (!input.modelName || input.modelName.trim().length < 2) {
      throw new ValidationException('Model name must be at least 2 characters', 'modelName');
    }
    if (input.basePrice.amountInCents <= 0) {
      throw new ValidationException('Base price must be greater than zero', 'basePrice');
    }

    const now = new Date();
    const model = new PhoneModel({
      id: '',
      organizationId: input.organizationId,
      brand: input.brand.trim(),
      modelName: input.modelName.trim(),
      storage: input.storage?.trim() || null,
      color: input.color?.trim() || null,
      sku: input.sku,
      basePrice: input.basePrice,
      createdAt: now,
      updatedAt: now,
    });

    model.addDomainEvent(
      new PhoneModelCreatedEvent(
        model.id,
        input.organizationId,
        input.sku.value,
        model.brand,
        model.modelName,
      ),
    );

    return model;
  }

  static reconstitute(props: PhoneModelProps): PhoneModel {
    return new PhoneModel(props);
  }

  get id(): string { return this.props.id; }
  get organizationId(): string { return this.props.organizationId; }
  get brand(): string { return this.props.brand; }
  get modelName(): string { return this.props.modelName; }
  get storage(): string | null { return this.props.storage; }
  get color(): string | null { return this.props.color; }
  get sku(): Sku { return this.props.sku; }
  get basePrice(): Money { return this.props.basePrice; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  changePrice(newPrice: Money): void {
    if (newPrice.amountInCents <= 0) {
      throw new ValidationException('Base price must be greater than zero', 'basePrice');
    }
    const oldPrice = this.props.basePrice;
    if (oldPrice.equals(newPrice)) return;

    this.props.basePrice = newPrice;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new PhoneModelPriceChangedEvent(
        this.props.id,
        this.props.organizationId,
        oldPrice.amountInCents,
        newPrice.amountInCents,
        newPrice.currency,
      ),
    );
  }

  rename(newModelName: string): void {
    if (!newModelName || newModelName.trim().length < 2) {
      throw new ValidationException('Model name must be at least 2 characters', 'modelName');
    }
    this.props.modelName = newModelName.trim();
    this.props.updatedAt = new Date();
  }
}