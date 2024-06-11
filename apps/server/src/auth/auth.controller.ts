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
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return {
      success: true,
    };
  }
}
