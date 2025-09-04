import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTypeController } from './controllers/project-type.controller';
import { ProjectTypeService } from './services/project-type.service';
import { ReportTemplatesController } from './controllers/report-templates.controller';
import { ReportTemplatesService } from './services/report-templates.service';
import { ProjectTypesEntity } from '../../database/entities/project-types.entity';
import { ReportTemplatesEntity } from '../../database/entities/report-templates.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProjectTypesEntity,
            ReportTemplatesEntity,
        ]),
    ],
    controllers: [
        ProjectTypeController,
        ReportTemplatesController,
    ],
    providers: [
        ProjectTypeService,
        ReportTemplatesService,
    ],
    exports: [
        ProjectTypeService,
        ReportTemplatesService,
    ],
})
export class ProjectTypeModule { }
