import { Body, Controller, Get, Post } from '@nestjs/common';
import { MonthlyTargetService } from './monthly-target.service';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';
import { CreateMonthlyTargetDto } from './dto/create-monthly-target.dto';

@Controller('monthly-target')
export class MonthlyTargetController {
  constructor(private readonly monthlyTargetService: MonthlyTargetService) {}
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async createMonthlyTarget(@Body() data: CreateMonthlyTargetDto) {
    return await this.monthlyTargetService.createMonthlyTarget(data);
  }

  @Get()
  async getMonthlyTargets() {
    return await this.monthlyTargetService.getAllMonthlyTargets();
  }
}
