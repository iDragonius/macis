import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCallScheduleDto {
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  contactDate: Date;

  @IsOptional()
  @IsString()
  notes: string;
}
