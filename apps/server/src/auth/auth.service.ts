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
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { MailService } from '../mail/mail.service';

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
  ) {}

  async signUp(data: AuthSignUpDto): Promise<Tokens> {
    const candidate = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (candidate) {
      throw new BadRequestException(ExceptionTypes.UNIQUE('user'));
    }
    const hashedPassword = await this.hashData(data.password);
    const createdUser = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        email: data.email,
      },
    });

    const tokens = await this.getTokens(createdUser.id, data.email);
    await this.addRtHash(createdUser.id, tokens.refreshToken);

    return tokens;
  }

  async signIn(
    data: AuthSignInDto,
    requestIp: string,
  ): Promise<{ success: boolean }> {
    const signInAttempts = await this.prisma.signInAttempts.findUnique({
      where: {
        ip: requestIp,
      },
    });

    if (signInAttempts) {
      if (
        signInAttempts.expirationDate &&
        new Date(signInAttempts.expirationDate).getTime() > new Date().getTime()
      ) {
        throw new ForbiddenException('Something get wrong');
      } else {
        await this.prisma.signInAttempts.update({
          where: {
            ip: requestIp,
          },
          data: {
            expirationDate: null,
            attempts: 0,
          },
        });
      }
    }

    const candidate = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!candidate) {
      throw new BadRequestException(ExceptionTypes.NONEXISTENT('user'));
    }
    const comparePasswords = await bcrypt.compare(
      data.password,
      candidate.password,
    );

    if (!comparePasswords) {
      if (!signInAttempts) {
        await this.prisma.signInAttempts.create({
          data: {
            ip: requestIp,
            attempts: 1,
          },
        });
      } else {
        if (signInAttempts.attempts === 3) {
          if (!signInAttempts.expirationDate) {
            await this.prisma.signInAttempts.update({
              where: {
                ip: requestIp,
              },
              data: {
                expirationDate: this.addDays(new Date(), 1),
              },
            });
          }
        } else {
          await this.prisma.signInAttempts.update({
            where: {
              ip: requestIp,
            },
            data: {
              attempts: signInAttempts.attempts + 1,
            },
          });
        }
      }
      throw new BadRequestException(ExceptionTypes.PASSWORD);
    }

    await this.prisma.userCodes.deleteMany({
      where: {
        userId: candidate.id,
      },
    });
    const code = Math.floor(Math.random() * 900000) + 100000;
    this.mailService.sendOtp(candidate.email, code);
    await this.prisma.userCodes.create({
      data: {
        code: String(code),
        type: 'OTP',
        userId: candidate.id,
        expirationDate: this.addMinutes(new Date(), 2),
      },
    });

    return {
      success: true,
    };
  }

  async verifyOtp(email: string, code: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('No user found');
    }

    const otps = await this.prisma.userCodes.findMany({
      where: {
        userId: user.id,
      },
    });

    if (otps.length === 0) {
      throw new ForbiddenException('redirect.to.sign-in');
    }

    if (otps[0].code !== code) {
      if (otps[0].attempts === 3) {
        await this.prisma.userCodes.deleteMany({
          where: {
            userId: user.id,
          },
        });
        throw new ForbiddenException('redirect.to.sign-in');
      } else {
        await this.prisma.userCodes.update({
          where: {
            id: otps[0].id,
          },
          data: {
            attempts: otps[0].attempts + 1,
          },
        });
        throw new BadRequestException('OTP code is wrong');
      }
    }
    if (new Date(otps[0].expirationDate).getTime() < new Date().getTime()) {
      throw new BadRequestException('redirect.to.sign-in');
    }
    await this.prisma.userCodes.delete({
      where: {
        id: otps[0].id,
      },
    });
    const tokens = await this.getTokens(user.id, user.email);
    await this.addRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId, refreshToken) {
    return await this.prisma.userToken.update({
      where: {
        refreshToken,
      },
      data: {
        isBlocked: true,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException(ExceptionTypes.NONEXISTENT('user'));
    const token = await this.prisma.userToken.findUnique({
      where: {
        refreshToken,
      },
    });
    if (!token) {
      throw new ForbiddenException({
        message: ExceptionTypes.UNEXPECTED_ERROR,
      });
    }
    if (token.isBlocked)
      throw new ForbiddenException({ message: ExceptionTypes.BLACKLIST_TOKEN });

    const tokenExpirationDate = token.expirationDate.valueOf();
    const currentDate = new Date();

    if (currentDate.valueOf() > tokenExpirationDate) {
      await this.prisma.userToken.delete({
        where: {
          refreshToken,
        },
      });
      throw new ForbiddenException({ message: ExceptionTypes.CODE_EXPIRED });
    }

    const newTokens = await this.getTokens(userId, user.email);
    await this.prisma.userToken.update({
      where: {
        userId,
      },
      data: {
        refreshToken: newTokens.refreshToken,
        expirationDate: this.addDays(currentDate, 30),
      },
    });
    return newTokens;
  }

  hashData(data): Promise<string> {
    return bcrypt.hash(data, 10);
  }
  async addRtHash(userId: string, refreshToken: string) {
    await this.prisma.userToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        refreshToken,
        expirationDate: this.addDays(new Date().toISOString(), 30),
      },
      create: {
        refreshToken,
        expirationDate: this.addDays(new Date().toISOString(), 30),
        userId,
      },
    });
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
