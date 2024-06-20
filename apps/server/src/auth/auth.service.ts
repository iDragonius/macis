import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { EnvironmentEnum } from '../core/enums';
import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '../mail/mail.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';

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
    private mailService: MailService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async signIn(data: AuthSignInDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new BadRequestException(ExceptionTypes.USER_NOT_FOUND);
    }
    const comparedPasswords = await bcrypt.compare(
      data.password,
      user.password,
    );
    if (!comparedPasswords) {
      throw new BadRequestException(ExceptionTypes.WRONG_PASSWORD);
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.assignNewTokenToUser(tokens, user.id);
    return tokens;
  }

  async signUp(data: AuthSignUpDto): Promise<{
    success: boolean;
  }> {
    const potentialExistingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (potentialExistingUser) {
      throw new BadRequestException(ExceptionTypes.USER_ALREADY_EXIST);
    }
    const hashedPassword = await this.hashData(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
    });
    if (!user) {
      throw new BadRequestException(ExceptionTypes.UNEXPECTED_ERROR);
    }

    return {
      success: true,
    };
  }

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
  async assignNewTokenToUser(tokens: Tokens, userId: string): Promise<void> {
    await this.prisma.userToken.create({
      data: {
        refreshToken: tokens.refreshToken,
        expirationDate: this.addDays(new Date(), 30),
        userId,
      },
    });
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
