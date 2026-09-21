import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { ValidationException } from '../../../../shared/domain/exceptions';
import { getJwtAccessOptions, getJwtRefreshOptions } from '../../../../../config/jwt.config';
import { PasswordHasher } from '../../../infrastructure/crypto/password-hasher.service';

export interface LoginInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginHandler {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: { memberships: { take: 1 } },
    });

    if (!user) {
      // Burn the same time a real hash would take — see PasswordHasher.burnTime
      await this.hasher.burnTime();
      throw new ValidationException('Invalid email or password', 'credentials');
    }

    const isValid = await this.hasher.verify(user.passwordHash, input.password);
    if (!isValid) {
      throw new ValidationException('Invalid email or password', 'credentials');
    }

    const membership = user.memberships[0];
    if (!membership) {
      throw new ValidationException('User has no organization', 'membership');
    }

    const accessToken = this.jwt.sign(
      { sub: user.id, orgId: membership.organizationId, email: user.email },
      getJwtAccessOptions(),
    );

    const refreshToken = this.jwt.sign(
      { sub: user.id, orgId: membership.organizationId },
      getJwtRefreshOptions(),
    );

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    };
  }
}