import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthVerifyOtpDto {
  @IsNotEmpty()
  code: string;
  @IsEmail()
  email: string;
}
