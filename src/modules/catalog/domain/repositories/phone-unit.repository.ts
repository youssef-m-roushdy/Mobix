import { PhoneUnit } from '../entities/phone-unit.entity';
import { Imei } from '../value-objects/imei.vo';

/**
 * PhoneUnitRepository — port for PhoneUnit persistence.
 *
 * WHY: Every method takes organizationId first — tenant isolation
 * enforced at the type level.
 */
export interface PhoneUnitRepository {
  save(unit: PhoneUnit): Promise<PhoneUnit>;
  findById(organizationId: string, id: string): Promise<PhoneUnit | null>;
  findByImei(organizationId: string, imei: Imei): Promise<PhoneUnit | null>;
  listByModel(organizationId: string, phoneModelId: string): Promise<PhoneUnit[]>;
  listInStock(organizationId: string): Promise<PhoneUnit[]>;
}

export const PHONE_UNIT_REPOSITORY = Symbol('PHONE_UNIT_REPOSITORY');