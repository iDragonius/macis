import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Public } from '../core/decorators';
import { Tokens } from './types';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: AuthSignInDto): Promise<Tokens> {
    return await this.authService.signIn(data);
  }
  @Roles(Role.ADMIN, Role.USER, Role.SUPER_ADMIN)
  @Post('/sign-up')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() data: AuthSignUpDto) {
    return await this.authService.signUp(data);
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
