import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PhoneModelRepository } from '../../domain/repositories/phone-model.repository';
import { PhoneModel } from '../../domain/entities/phone-model.entity';
import { Sku } from '../../domain/value-objects/sku.vo';
import { ConflictException } from '../../../shared/domain/exceptions';
import { PhoneModelMapper } from './phone-model.mapper';

/**
 * PrismaPhoneModelRepository — the domain port, implemented with Prisma.
 *
 * WHY: This is the only place in the Catalog context that imports Prisma.
 * Every query filters by organizationId to enforce tenant isolation.
 */
@Injectable()
export class PrismaPhoneModelRepository implements PhoneModelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(model: PhoneModel): Promise<PhoneModel> {
    const data = PhoneModelMapper.toPersistence(model);

    // If the entity has an id, it's an update. Otherwise insert.
    if (model.id) {
      const updated = await this.prisma.phoneModel.update({
        where: { id: model.id },
        data: {
          brand: data.brand,
          modelName: data.modelName,
          storage: data.storage,
          color: data.color,
          sku: data.sku,
          basePrice: data.basePrice,
        },
      });
      return PhoneModelMapper.toDomain(updated);
    }

    // Insert path — check for SKU collision within this tenant first.
    const skuCollision = await this.prisma.phoneModel.findFirst({
      where: {
        organizationId: model.organizationId,
        sku: data.sku,
      },
    });

    if (skuCollision) {
      throw new ConflictException(
        `SKU ${data.sku} already exists in this organization`,
        { field: 'sku', value: data.sku },
      );
    }

    const created = await this.prisma.phoneModel.create({
      data: {
        id: randomUUID(),
        organizationId: data.organizationId,
        brand: data.brand,
        modelName: data.modelName,
        storage: data.storage,
        color: data.color,
        sku: data.sku,
        basePrice: data.basePrice,
      },
    });

    return PhoneModelMapper.toDomain(created);
  }

  async findById(organizationId: string, id: string): Promise<PhoneModel | null> {
    const row = await this.prisma.phoneModel.findFirst({
      where: { id, organizationId },
    });
    return row ? PhoneModelMapper.toDomain(row) : null;
  }

  async findBySku(organizationId: string, sku: Sku): Promise<PhoneModel | null> {
    const row = await this.prisma.phoneModel.findFirst({
      where: { organizationId, sku: sku.value },
    });
    return row ? PhoneModelMapper.toDomain(row) : null;
  }

  async listByOrganization(organizationId: string): Promise<PhoneModel[]> {
    const rows = await this.prisma.phoneModel.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(PhoneModelMapper.toDomain);
  }
}