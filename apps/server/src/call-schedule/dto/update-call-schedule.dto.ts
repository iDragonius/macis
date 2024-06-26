import { PartialType } from '@nestjs/mapped-types';
import { CreateCallScheduleDto } from './create-call-schedule.dto';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCallScheduleDto extends PartialType(CreateCallScheduleDto) {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  nextContactDate: Date;

  @IsOptional()
  @IsString()
  reasonForRejection: string;
}
