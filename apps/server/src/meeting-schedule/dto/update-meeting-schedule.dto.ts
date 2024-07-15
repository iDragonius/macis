import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingScheduleDto } from './create-meeting-schedule.dto';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMeetingScheduleDto extends PartialType(
  CreateMeetingScheduleDto,
) {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  nextMeetingDate: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  nextContactDate: Date;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsOptional()
  @IsString()
  meetingTime: string;
}
