import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendRequestDto } from './dto/send-request.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async requestTest(sendRequestDto: SendRequestDto) {
    await this.mailerService.sendMail({
      to: sendRequestDto.email.trim(),
      subject: 'TESTGORILLACLONE INVITATION',
      template: 'request',
      context: {
        email: sendRequestDto.email.trim(),
        code: sendRequestDto.code.trim(),
        url: sendRequestDto.url.trim(),
      },
    });
    return 'ok';
  }
}
