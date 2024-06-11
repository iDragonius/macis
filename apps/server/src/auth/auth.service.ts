import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { EnvironmentEnum } from '../core/enums';
import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

export type SendMailDto = {
  from?: string | Address;
  to: string | Address;
  subject: string;
  text: string;
  html: string;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  hashData(data): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        { sub: userId, email, jti: nanoid(10) },
        {
          secret: this.configService.get<string>(
            EnvironmentEnum.ACCESS_SECRET_KEY,
          ),
          expiresIn: 30 * 24 * 60 * 60,
        },
      ),
      this.jwtService.sign(
        { sub: userId, email, jti: nanoid(10) },
        {
          secret: this.configService.get<string>(
            EnvironmentEnum.REFRESH_SECRET_KEY,
          ),
          expiresIn: 30 * 24 * 60 * 60,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addMinutes(date, minutes) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }
}
