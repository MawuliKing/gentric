import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) { }

  async sendDefault(email: string, message: String) {
    const currentYear = new Date().getFullYear();
    await this.mailerService.sendMail({
      to: email,
      from: 'No-Reply -  Gentric <gentric@gmail.com>',
      subject: 'Gentric - Mailing Service',
      template: 'default',
      context: {
        subject: 'Gentric',
        message: message,
        year: currentYear,
      },
    });
  }

  async sendVerificationEmail(email: string, firstName: string, token: string) {
    const currentYear = new Date().getFullYear();
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      from: 'No-Reply - Gentric <noreply@gentric.com>',
      subject: 'Please Verify Your Email Address - Gentric',
      template: 'verification',
      context: {
        firstName,
        verificationLink,
        year: currentYear,
      },
    });
  }

  async sendPasswordResetEmail(email: string, firstName: string, token: string) {
    const currentYear = new Date().getFullYear();
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      from: 'No-Reply - Gentric <noreply@gentric.com>',
      subject: 'Password Reset Request - Gentric',
      template: 'password-reset',
      context: {
        firstName,
        resetLink,
        year: currentYear,
      },
    });
  }

  async sendPasswordEmail(email: string, firstName: string, password: string, userType: 'agent' | 'customer') {
    const currentYear = new Date().getFullYear();
    const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;

    await this.mailerService.sendMail({
      to: email,
      from: 'No-Reply - Gentric <noreply@gentric.com>',
      subject: `Welcome to Gentric - Your ${userType === 'agent' ? 'Agent' : 'Customer'} Account`,
      template: 'password-welcome',
      context: {
        firstName,
        password,
        userType: userType === 'agent' ? 'Agent' : 'Customer',
        loginLink,
        year: currentYear,
      },
    });
  }
}
