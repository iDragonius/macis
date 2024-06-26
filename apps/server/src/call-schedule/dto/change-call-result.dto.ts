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
}
