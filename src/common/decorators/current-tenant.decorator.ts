import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts organizationId from the authenticated request.
 * Populated by JwtStrategy.validate().
 */
export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.orgId;
  },
);