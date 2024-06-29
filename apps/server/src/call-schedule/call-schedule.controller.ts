import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { CallScheduleService } from './call-schedule.service';
import { CreateCallScheduleDto } from './dto/create-call-schedule.dto';
import { ChangeCallResultDto } from './dto/change-call-result.dto';
import { CallResult } from '@prisma/client';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';
import { UpdateCallScheduleDto } from './dto/update-call-schedule.dto';

@Controller('call-schedule')
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async createCall(@Body() data: CreateCallScheduleDto) {
    return await this.callScheduleService.createCall(data);
  }
  @Patch('/result/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async changeCallResult(
    @Body() data: ChangeCallResultDto,
    @Param('id') callId: string,
  ) {
    return await this.callScheduleService.changeCallResult(data, callId);
  }
  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateCall(
    @Body() data: UpdateCallScheduleDto,
    @Param('id') callId: string,
  ) {
    return await this.callScheduleService.updateCall(data, callId);
  }

  @Get()
  async getAllCalls(@Query('result') result?: CallResult) {
    return await this.callScheduleService.getAllCalls(result);
  }
  @Get('/daily')
  async getDailyCallSchedule() {
    return await this.callScheduleService.getDailyCallSchedule();
  }
  @Get(':id')
  async getCall(@Param('id') id: string) {
    return await this.callScheduleService.getCall(id);
  }
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  async deleteCall(@Param('id') id: string) {
    return await this.callScheduleService.deleteCall(id);
  }
}
