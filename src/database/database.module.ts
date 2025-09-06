import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { IdentityEntity } from './entities/identity.entity';
import { NotificationEntity } from './entities/notification.entity';
import { ProjectTypesEntity } from './entities/project-types.entity';
import { ReportTemplatesEntity } from './entities/report-templates.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity.{ts}'],
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
        dropSchema: false,
        // schema: 'dev',
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([
      //Authentication
      IdentityEntity,
      NotificationEntity,
      //Form Builder
      ProjectTypesEntity,
      ReportTemplatesEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
