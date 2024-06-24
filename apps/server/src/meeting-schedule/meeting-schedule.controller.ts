import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MeetingScheduleService } from './meeting-schedule.service';
import { CreateMeetingScheduleDto } from './dto/create-meeting-schedule.dto';
import { UpdateMeetingScheduleDto } from './dto/update-meeting-schedule.dto';
import { CallResult, MeetingResult } from '@prisma/client';
import { ChangeCallResultDto } from '../call-schedule/dto/change-call-result.dto';
import { ChangeMeetingResultDto } from './dto/change-meeting-result.dto';

@Controller('meeting-schedule')
export class MeetingScheduleController {
  constructor(
    private readonly meetingScheduleService: MeetingScheduleService,
  ) {}

  @Post()
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
