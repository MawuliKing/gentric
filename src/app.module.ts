import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './utils/constants/constants';
import { EmailModule } from './api/email/email.module';
import { NotificationModule } from './api/notification/notification.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100y' },
    }),
    DatabaseModule,
    EmailModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
