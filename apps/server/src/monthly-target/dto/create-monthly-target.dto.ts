import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Month } from '@prisma/client';

export class CreateMonthlyTargetDto {
  @IsNotEmpty()
  @IsString()
  managerId: string;

  @IsNotEmpty()
  @IsNumber()
  meetingTarget: number;

  @IsNotEmpty()
  @IsEnum(Month)
  month: Month;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}
