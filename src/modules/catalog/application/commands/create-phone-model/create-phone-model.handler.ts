import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreatePhoneModelCommand } from './create-phone-model.command';
import { PHONE_MODEL_REPOSITORY } from '../../../domain/repositories/phone-model.repository';
import type { PhoneModelRepository } from '../../../domain/repositories/phone-model.repository';
import { PhoneModel } from '../../../domain/entities/phone-model.entity';
import { Sku } from '../../../domain/value-objects/sku.vo';
import { Money } from '../../../../shared/domain/value-objects/money.vo';

@Injectable()
export class CreatePhoneModelHandler {
  constructor(
    @Inject(PHONE_MODEL_REPOSITORY)
    private readonly repo: PhoneModelRepository,
  ) {}

  async execute(command: CreatePhoneModelCommand): Promise<PhoneModel> {
    const sku = Sku.create(command.sku);
    const basePrice = Money.fromDecimal(command.basePrice, command.currency);

    const model = PhoneModel.create({
      organizationId: command.organizationId,
      brand: command.brand,
      modelName: command.modelName,
      storage: command.storage,
      color: command.color,
      sku,
      basePrice,
    });

    const saved = await this.repo.save(model);
    return saved;
  }
}