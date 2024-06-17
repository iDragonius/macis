import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../core/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  me(@GetCurrentUserId() userId: string) {
    return this.userService.me(userId);
  }
}
