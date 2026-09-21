import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PrismaPhoneModelRepository } from './infrastructure/persistence/prisma-phone-model.repository';
import { PHONE_MODEL_REPOSITORY } from './domain/repositories/phone-model.repository';

import { CreatePhoneModelHandler } from './application/commands/create-phone-model/create-phone-model.handler';
import { CatalogController } from './interface/catalog.controller';

@Module({
  imports: [PassportModule],
  controllers: [CatalogController],
  providers: [
    CreatePhoneModelHandler,
    {
      provide: PHONE_MODEL_REPOSITORY,
      useClass: PrismaPhoneModelRepository,
    },
  ],
  exports: [PHONE_MODEL_REPOSITORY],
})
export class CatalogModule {}