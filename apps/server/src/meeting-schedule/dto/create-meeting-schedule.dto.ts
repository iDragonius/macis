import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMeetingScheduleDto {
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  contactDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  meetingDate: Date;

  @IsOptional()
  @IsString()
  notes: string;
}
