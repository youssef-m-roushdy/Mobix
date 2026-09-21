import { PhoneModel as PrismaPhoneModel } from '../../../../generated/prisma/client';
import { PhoneModel } from '../../domain/entities/phone-model.entity';
import { Sku } from '../../domain/value-objects/sku.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';

/**
 * PhoneModelMapper — translates between Prisma rows and domain entities.
 *
 * WHY: The domain must not know about Prisma's Decimal or the generated
 * client. The infrastructure layer must not know about the domain's
 * value objects. This file is the only place both worlds meet.
 */
export class PhoneModelMapper {
  static toDomain(row: PrismaPhoneModel): PhoneModel {
    return PhoneModel.reconstitute({
      id: row.id,
      organizationId: row.organizationId,
      brand: row.brand,
      modelName: row.modelName,
      storage: row.storage,
      color: row.color,
      sku: Sku.create(row.sku),
      basePrice: Money.fromDecimal(Number(row.basePrice), 'USD'),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(model: PhoneModel): {
    id: string;
    organizationId: string;
    brand: string;
    modelName: string;
    storage: string | null;
    color: string | null;
    sku: string;
    basePrice: number;
  } {
    return {
      id: model.id,
      organizationId: model.organizationId,
      brand: model.brand,
      modelName: model.modelName,
      storage: model.storage,
      color: model.color,
      sku: model.sku.value,
      basePrice: model.basePrice.toDecimal(),
    };
  }
}