import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from '../strategies';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, MailService],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
