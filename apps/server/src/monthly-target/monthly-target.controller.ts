import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MonthlyTargetService } from './monthly-target.service';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';
import { CreateMonthlyTargetDto } from './dto/create-monthly-target.dto';
import { UpdateMonthlyTargetDto } from './dto/update-monthly-target.dto';

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
  @Get(':id')
  async getMonthlyTarget(@Param('id') id: string) {
    return await this.monthlyTargetService.getMonthlyTarget(id);
  }
  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async updateMonthlyTarget(
    @Param('id') id: string,
    @Body() data: UpdateMonthlyTargetDto,
  ) {
    return await this.monthlyTargetService.updateMonthlyTarget(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async deleteMonthlyTarget(@Param('id') id: string) {
    return await this.monthlyTargetService.deleteMonthlyTarget(id);
  }
}
