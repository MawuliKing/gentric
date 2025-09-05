import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './utils/constants/constants';
import { EmailModule } from './api/email/email.module';
import { NotificationModule } from './api/notification/notification.module';
import { AuthModule } from './api/auth/auth.module';
import { ProjectTypeModule } from './api/project-type/project-type.module';
import { ProjectModule } from './api/project/project.module';
import { AgentModule } from './api/agent/agent.module';
import { CustomerModule } from './api/customer/customer.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './utils/guards/auth.giuard';
import { ReportsController } from './api/reports/reports.controller';
import { ReportsService } from './api/reports/reports.service';

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
    ProjectTypeModule,
    ProjectModule,
    AgentModule,
    CustomerModule,
  ],
  providers: [
    {
      useClass: AuthGuard,
      provide: APP_GUARD,
    },
    ReportsService,
  ],
  controllers: [ReportsController],
})
export class AppModule { }
