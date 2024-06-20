import { CallResult } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangeCallResultDto {
  @IsNotEmpty()
  @IsEnum(CallResult)
  result: CallResult;

  @IsOptional()
  @IsString()
  notes: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  contactDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  nextContactDate: Date;

  @IsOptional()
  @IsString()
  reasonForRejection: string;
}
