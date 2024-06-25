import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { CallScheduleService } from './call-schedule.service';
import { CreateCallScheduleDto } from './dto/create-call-schedule.dto';
import { ChangeCallResultDto } from './dto/change-call-result.dto';
import { CallResult } from '@prisma/client';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';

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

  @Get()
  async getAllCalls(@Query('result') result?: CallResult) {
    return await this.callScheduleService.getAllCalls(result);
  }

  @Get('/daily')
  async getDailyCallSchedule() {
    return await this.callScheduleService.getDailyCallSchedule();
  }
}
