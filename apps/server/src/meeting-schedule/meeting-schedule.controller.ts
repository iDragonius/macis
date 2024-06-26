import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MeetingScheduleService } from './meeting-schedule.service';
import { CreateMeetingScheduleDto } from './dto/create-meeting-schedule.dto';
import { MeetingResult } from '@prisma/client';
import { ChangeMeetingResultDto } from './dto/change-meeting-result.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';
import { UpdateMeetingScheduleDto } from './dto/update-meeting-schedule.dto';

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
  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateMeeting(
    @Body() data: UpdateMeetingScheduleDto,
    @Param('id') id: string,
  ) {
    return await this.meetingScheduleService.updateMeeting(data, id);
  }

  @Get()
  async getAllMeetings(@Query('result') result?: MeetingResult) {
    return await this.meetingScheduleService.getAllMeetings(result);
  }

  @Get(':id')
  async getMeeting(@Param('id') id: string) {
    return await this.meetingScheduleService.getMeeting(id);
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
