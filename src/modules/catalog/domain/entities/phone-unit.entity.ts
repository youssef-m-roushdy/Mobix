import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import {
  ConflictException,
  ValidationException,
} from '../../../shared/domain/exceptions';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { Imei } from '../value-objects/imei.vo';
import { PhoneCondition, PhoneStatus } from '../enums/phone-status.enum';
import { PhoneStatusMachine } from '../phone-status-machine';

/**
 * PhoneUnit — aggregate root for a physical phone.
 *
 * WHY: A PhoneModel is a definition ("iPhone 15 Pro 256GB"). A PhoneUnit
 * is one specific device with an IMEI, a condition, and a status. It has
 * its own lifecycle: received → in stock → reserved → sold.
 */
export interface PhoneUnitProps {
  id: string;
  organizationId: string;
  phoneModelId: string;
  imei: Imei;
  condition: PhoneCondition;
  status: PhoneStatus;
  purchasePrice: Money | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PhoneUnit extends AggregateRoot {
  private constructor(private props: PhoneUnitProps) {
    super();
  }

  static create(input: {
    organizationId: string;
    phoneModelId: string;
    imei: Imei;
    condition: PhoneCondition;
    purchasePrice: Money | null;
  }): PhoneUnit {
    if (!input.organizationId) {
      throw new ValidationException('organizationId is required', 'organizationId');
    }
    if (!input.phoneModelId) {
      throw new ValidationException('phoneModelId is required', 'phoneModelId');
    }

    const now = new Date();
    return new PhoneUnit({
      id: '',
      organizationId: input.organizationId,
      phoneModelId: input.phoneModelId,
      imei: input.imei,
      condition: input.condition,
      status: PhoneStatus.InStock,
      purchasePrice: input.purchasePrice,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: PhoneUnitProps): PhoneUnit {
    return new PhoneUnit(props);
  }

  get id(): string { return this.props.id; }
  get organizationId(): string { return this.props.organizationId; }
  get phoneModelId(): string { return this.props.phoneModelId; }
  get imei(): Imei { return this.props.imei; }
  get condition(): PhoneCondition { return this.props.condition; }
  get status(): PhoneStatus { return this.props.status; }
  get purchasePrice(): Money | null { return this.props.purchasePrice; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  markAsReserved(): void {
    this.transitionTo(PhoneStatus.Reserved);
  }

  markAsSold(): void {
    this.transitionTo(PhoneStatus.Sold);
  }

  markAsDefective(): void {
    this.transitionTo(PhoneStatus.Defective);
  }

  returnToStock(): void {
    this.transitionTo(PhoneStatus.InStock);
  }

  private transitionTo(next: PhoneStatus): void {
    PhoneStatusMachine.assertCanTransition(this.props.status, next);
    this.props.status = next;
    this.props.updatedAt = new Date();
  }
}