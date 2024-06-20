import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingScheduleDto } from './create-meeting-schedule.dto';

export class UpdateMeetingScheduleDto extends PartialType(CreateMeetingScheduleDto) {}
