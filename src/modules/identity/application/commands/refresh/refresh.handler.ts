import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { getJwtAccessOptions } from '../../../../../config/jwt.config';

export interface RefreshInput {
  userId: string;
  orgId: string;
  refreshToken: string;
}

@Injectable()
export class RefreshHandler {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async execute(input: RefreshInput) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId: input.userId, organizationId: input.orgId },
    });

    if (!membership) {
      throw new UnauthorizedException('Membership no longer valid');
    }

    const accessToken = this.jwt.sign(
      { sub: input.userId, orgId: input.orgId },
      getJwtAccessOptions(),
    );

    return { accessToken };
  }
}