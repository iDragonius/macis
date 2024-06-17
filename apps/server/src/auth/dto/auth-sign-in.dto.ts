import { IsEmail, IsNotEmpty, Min } from 'class-validator';

export class AuthSignInDto {
  @IsEmail(undefined, {
    message: 'isNotEmail',
  })
  @IsNotEmpty({ message: 'mustBeFilled' })
  email: string;

  @IsNotEmpty({ message: 'mustBeFilled' })
  password: string;
}
