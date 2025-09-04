import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { initializeFirebase } from './config/firebase.config';

@Global()
@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {
  constructor(){
    initializeFirebase();
  }
}
