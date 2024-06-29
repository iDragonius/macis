import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCurationCallDto {
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  meetingDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  callDate: Date;

  @IsOptional()
  @IsString()
  customerFeedback: string;

  @IsOptional()
  @IsString()
  customerRequests: string;

  @IsOptional()
  @IsString()
  notes: string;
}
