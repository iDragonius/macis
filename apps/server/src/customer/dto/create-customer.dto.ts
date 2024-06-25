import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CustomerStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  head: string;

  @IsString()
  @IsOptional()
  contactNumber: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  companyEstablishmentDate: Date;

  @IsString()
  @IsOptional()
  curatorId: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  ownersBirthday: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  contractDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  contractExpirationDate: Date;

  @IsString()
  @IsOptional()
  service: string;

  @IsString()
  @IsOptional()
  payment: string;

  @IsString()
  @IsOptional()
  termsOfPayment: string;

  @IsString()
  @IsOptional()
  terminationReason: string;

  @IsString()
  @IsOptional()
  position: string;

  @IsString()
  @IsOptional()
  source: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsEnum(CustomerStatus)
  @IsOptional()
  status: CustomerStatus;
}
