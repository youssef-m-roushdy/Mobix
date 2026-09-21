import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { IdentityController } from './interface/identity.controller';
import { RegisterHandler } from './application/commands/register/register.handler';
import { LoginHandler } from './application/commands/login/login.handler';
import { RefreshHandler } from './application/commands/refresh/refresh.handler';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtRefreshStrategy } from './infrastructure/auth/jwt-refresh.strategy';
import { PasswordHasher } from './infrastructure/crypto/password-hasher.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [IdentityController],
  providers: [
    PasswordHasher,       // ← this was missing
    RegisterHandler,
    LoginHandler,
    RefreshHandler,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class IdentityModule {}