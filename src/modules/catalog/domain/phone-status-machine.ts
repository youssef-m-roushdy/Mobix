import { ConflictException } from '../../shared/domain/exceptions';
import { PhoneStatus } from './enums/phone-status.enum';

/**
 * PhoneStatusMachine — enforces legal status transitions.
 *
 * WHY: Not every transition is valid. A SOLD phone cannot go back to
 * IN_STOCK without a refund flow, which is a different use case with
 * its own rules. Enforcing this in the domain prevents illegal states
 * from ever reaching the database.
 */
export class PhoneStatusMachine {
  private static readonly allowed: Record<PhoneStatus, PhoneStatus[]> = {
    [PhoneStatus.InStock]: [PhoneStatus.Reserved, PhoneStatus.Sold, PhoneStatus.Defective],
    [PhoneStatus.Reserved]: [PhoneStatus.InStock, PhoneStatus.Sold],
    [PhoneStatus.Sold]: [], // terminal — refunds are a separate flow
    [PhoneStatus.Defective]: [PhoneStatus.InStock, PhoneStatus.Reserved],
  };

  static assertCanTransition(from: PhoneStatus, to: PhoneStatus): void {
    if (from === to) return;
    const allowed = PhoneStatusMachine.allowed[from] ?? [];
    if (!allowed.includes(to)) {
      throw new ConflictException(
        `Cannot transition phone unit from ${from} to ${to}`,
        { from, to },
      );
    }
  }
}