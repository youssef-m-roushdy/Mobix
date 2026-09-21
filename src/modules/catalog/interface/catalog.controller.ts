import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreatePhoneModelHandler } from '../application/commands/create-phone-model/create-phone-model.handler';
import { CreatePhoneModelCommand } from '../application/commands/create-phone-model/create-phone-model.command';
import { CreatePhoneModelDto } from './dto/create-phone-model.dto';
import { CurrentTenant } from '../../../common/decorators/current-tenant.decorator';
import { PHONE_MODEL_REPOSITORY } from '../domain/repositories/phone-model.repository';
import type { PhoneModelRepository } from '../domain/repositories/phone-model.repository';

@ApiTags('catalog')
@ApiBearerAuth('access-token')
@Controller('catalog/phone-models')
@UseGuards(AuthGuard('jwt'))
export class CatalogController {
  constructor(
    private readonly createHandler: CreatePhoneModelHandler,
    @Inject(PHONE_MODEL_REPOSITORY)
    private readonly phoneModelRepo: PhoneModelRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a phone model' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Duplicate SKU in this organization' })
  async create(
    @CurrentTenant() organizationId: string,
    @Body() dto: CreatePhoneModelDto,
  ) {
    const command = new CreatePhoneModelCommand(
      organizationId,
      dto.brand,
      dto.modelName,
      dto.storage ?? null,
      dto.color ?? null,
      dto.sku,
      dto.basePrice,
      dto.currency ?? 'USD',
    );

    const saved = await this.createHandler.execute(command);

    return {
      id: saved.id,
      organizationId: saved.organizationId,
      brand: saved.brand,
      modelName: saved.modelName,
      storage: saved.storage,
      color: saved.color,
      sku: saved.sku.value,
      basePrice: saved.basePrice.toDecimal(),
      currency: saved.basePrice.currency,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List phone models for the current tenant' })
  async list(@CurrentTenant() organizationId: string) {
    const models = await this.phoneModelRepo.listByOrganization(organizationId);
    return models.map((m) => ({
      id: m.id,
      brand: m.brand,
      modelName: m.modelName,
      storage: m.storage,
      color: m.color,
      sku: m.sku.value,
      basePrice: m.basePrice.toDecimal(),
      currency: m.basePrice.currency,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }
}