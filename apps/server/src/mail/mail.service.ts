import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserCredentials({ fullName, email, password }) {
    const html = `
      <div>
        <h3>Salam, ${fullName}!</h3>
        <p>Sistemə daxil olmaq üçün email və şifəriniz:</p>
        <hr/>
        
        <p style="font-weight: bold">Email: <span style="font-weight: normal">${email}</span></p>
        <p style="font-weight: bold">Şifrə: <span style="font-weight: normal">${password}</span></p> 
        </div>
    
    `;
    return await this.mailService.sendMail({
      to: email,
      from: this.configService.get<string>('MAIL_FROM'),
      subject: 'İstifadəçi məlumatları',
      html,
    });
  }
}
