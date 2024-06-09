import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentEnum } from '../core/enums';

type JwtPayload = {
  sub: string;
  email: string;
  jti: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(EnvironmentEnum.ACCESS_SECRET_KEY),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
