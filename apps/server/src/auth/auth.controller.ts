import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { GetCurrentUser, GetCurrentUserId, Public } from '../core/decorators';
import { Tokens } from './types';
import { RtGuard } from '../core/guards';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { AuthVerifyOtpDto } from './dto/auth-verify-otp.dto';
import { AuthSignInDto } from './dto/auth-sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() data: AuthSignUpDto): Promise<{ success: boolean }> {
    await this.authService.signUp(data);

    return {
      success: true,
    };
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.CREATED)
  async signIn(
    @Body() data: AuthSignInDto,
    @Ip() ip: string,
  ): Promise<{ success: boolean }> {
    return await this.authService.signIn(data, ip);
  }
  @Public()
  @Post('/verify-otp')
  @HttpCode(HttpStatus.CREATED)
  async verifyOtp(@Body() data: AuthVerifyOtpDto): Promise<Tokens> {
    return await this.authService.verifyOtp(data.email, String(data.code));
  }

  @Public()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return {
      success: true,
    };
  }

  @Public()
  @Post('/refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);

    return tokens;
  }
}
