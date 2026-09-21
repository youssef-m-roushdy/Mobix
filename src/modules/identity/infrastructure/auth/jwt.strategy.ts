import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface AccessTokenPayload {
  sub: string;
  orgId: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'dev-access-change-me',
      issuer: process.env.JWT_ISSUER ?? 'mobix',
      audience: process.env.JWT_AUDIENCE ?? 'mobix-api',
    });
  }

  async validate(payload: AccessTokenPayload) {
    return {
      userId: payload.sub,
      orgId: payload.orgId,
      email: payload.email,
    };
  }
}