import { IsEnum, IsOptional } from 'class-validator';
import { CustomerStatus } from '@prisma/client';

export class ChangeCustomerStatusDto {
  @IsEnum(CustomerStatus)
  status: CustomerStatus;
}
