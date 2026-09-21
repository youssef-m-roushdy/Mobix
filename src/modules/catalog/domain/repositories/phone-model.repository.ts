import { PhoneModel } from '../entities/phone-model.entity';
import { Sku } from '../value-objects/sku.vo';

/**
 * PhoneModelRepository — port defined by the domain.
 *
 * WHY: The domain states *what* it needs, not *how*. Infrastructure
 * provides the Prisma implementation. Every method takes organizationId
 * first — tenant isolation enforced at the type level.
 */
export interface PhoneModelRepository {
  save(model: PhoneModel): Promise<PhoneModel>;
  findById(organizationId: string, id: string): Promise<PhoneModel | null>;
  findBySku(organizationId: string, sku: Sku): Promise<PhoneModel | null>;
  listByOrganization(organizationId: string): Promise<PhoneModel[]>;
}

export const PHONE_MODEL_REPOSITORY = Symbol('PHONE_MODEL_REPOSITORY');