import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../core/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Get('/me')
  async me(@GetCurrentUserId() userId: string) {
    return this.userService.me(userId);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
