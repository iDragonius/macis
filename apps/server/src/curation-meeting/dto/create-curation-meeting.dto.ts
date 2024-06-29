import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCurationMeetingDto {
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  meetingDate: Date;

  @IsOptional()
  @IsString()
  meetingTime: string;

  @IsOptional()
  @IsString()
  customerFeedback: string;

  @IsOptional()
  @IsString()
  customerRequests: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  nuances: string;

  @IsOptional()
  @IsString()
  referenceCompanies: string;
}
