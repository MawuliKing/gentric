import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportSubmissionEntity } from '../../database/entities/report-submission.entity';
import { ProjectsEntity } from '../../database/entities/project.entity';
import { ReportTemplatesEntity } from '../../database/entities/report-templates.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportSubmissionEntity,
      ProjectsEntity,
      ReportTemplatesEntity,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
