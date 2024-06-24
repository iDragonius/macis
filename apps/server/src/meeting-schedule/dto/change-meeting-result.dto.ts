import { CallResult, MeetingResult } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangeMeetingResultDto {
  @IsNotEmpty()
  @IsEnum(MeetingResult)
  result: MeetingResult;
}
