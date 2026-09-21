import { Module } from '@nestjs/common';
import { PrismaPhoneModelRepository } from './infrastructure/persistence/prisma-phone-model.repository';
import { PHONE_MODEL_REPOSITORY } from './domain/repositories/phone-model.repository';

@Module({
  providers: [
    {
      provide: PHONE_MODEL_REPOSITORY,
      useClass: PrismaPhoneModelRepository,
    },
  ],
  exports: [PHONE_MODEL_REPOSITORY],
})
export class CatalogModule {}