import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityEntity } from 'src/database/entities/identity.entity';
import { NotificationEntity } from 'src/database/entities/notification.entity';
import { StructuredResponse } from 'src/utils/dto/structured-response.dto';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { SendNotificationDto } from 'src/utils/dto/send-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepo: Repository<NotificationEntity>,
  ) { }


  async sendSmsNotification({ phoneNumber, message }: { phoneNumber: string, message: string }) {
    console.log("SMS SENT");
  }

}
