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
import { AuthSignInDto } from './dto/auth-sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: AuthSignInDto): Promise<Tokens> {
    return await this.authService.signIn(data);
  }

  @Public()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return {
      success: true,
    };
  }
}
