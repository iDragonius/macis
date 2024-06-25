import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MeetingScheduleService } from './meeting-schedule.service';
import { CreateMeetingScheduleDto } from './dto/create-meeting-schedule.dto';
import { MeetingResult } from '@prisma/client';
import { ChangeMeetingResultDto } from './dto/change-meeting-result.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';

@Controller('meeting-schedule')
export class MeetingScheduleController {
  constructor(
    private readonly meetingScheduleService: MeetingScheduleService,
  ) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async createMeeting(@Body() data: CreateMeetingScheduleDto) {
    return await this.meetingScheduleService.createMeeting(data);
  }

  @Get()
  async getAllMeetings(@Query('result') result?: MeetingResult) {
    return await this.meetingScheduleService.getAllMeetings(result);
  }

  @Get('/daily')
  async getDailyMeetingSchedule() {
    return await this.meetingScheduleService.getDailyMeetingSchedule();
  }

  @Patch('/result/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async changeCallResult(
    @Body() data: ChangeMeetingResultDto,
    @Param('id') meetingId: string,
  ) {
    return await this.meetingScheduleService.changeMeetingResult(
      data,
      meetingId,
    );
  }
}
