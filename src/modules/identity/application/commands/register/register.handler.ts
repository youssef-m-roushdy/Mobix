import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { ValidationException, ConflictException } from '../../../../shared/domain/exceptions';
import { getJwtAccessOptions, getJwtRefreshOptions } from '../../../../../config/jwt.config';
import { PasswordHasher } from '../../../infrastructure/crypto/password-hasher.service';

export interface RegisterInput {
  orgName: string;
  orgSlug: string;
  email: string;
  password: string;
  userName: string;
}

@Injectable()
export class RegisterHandler {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: RegisterInput) {
    if (!input.orgName || input.orgName.trim().length < 2) {
      throw new ValidationException('Organization name must be at least 2 characters', 'orgName');
    }
    if (!/^[a-z0-9-]+$/.test(input.orgSlug)) {
      throw new ValidationException('Slug must contain only lowercase letters, numbers, and hyphens', 'orgSlug');
    }
    if (!input.email.includes('@')) {
      throw new ValidationException('Invalid email', 'email');
    }
    if (!input.password || input.password.length < 8) {
      throw new ValidationException('Password must be at least 8 characters', 'password');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException('Email already registered', { field: 'email' });
    }

    const passwordHash = await this.hasher.hash(input.password);

    const { organization, user } = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: input.orgName, slug: input.orgSlug },
      });
      const usr = await tx.user.create({
        data: { email: input.email, passwordHash, name: input.userName },
      });
      await tx.membership.create({
        data: { organizationId: org.id, userId: usr.id, role: 'ADMIN' },
      });
      return { organization: org, user: usr };
    });

    const accessToken = this.jwt.sign(
      { sub: user.id, orgId: organization.id, email: user.email },
      getJwtAccessOptions(),
    );

    const refreshToken = this.jwt.sign(
      { sub: user.id, orgId: organization.id },
      getJwtRefreshOptions(),
    );

    return {
      organization: { id: organization.id, name: organization.name, slug: organization.slug },
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    };
  }
}