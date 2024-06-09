import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtp(email: string, otp: number) {
    const text = `Hello ${email}, this is your OTP: ${otp}`;

    return await this.mailService.sendMail({
      to: email,
      from: this.configService.get<string>('MAIL_FROM'),
      subject: 'OTP',
      text,
    });
  }
}
