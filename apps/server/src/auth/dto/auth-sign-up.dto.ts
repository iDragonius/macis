import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthSignUpDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
