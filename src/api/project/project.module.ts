import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectsEntity } from '../../database/entities/project.entity';
import { IdentityEntity } from '../../database/entities/identity.entity';
import { ProjectTypesEntity } from '../../database/entities/project-types.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProjectsEntity,
            IdentityEntity,
            ProjectTypesEntity,
        ]),
    ],
    controllers: [
        ProjectController,
    ],
    providers: [
        ProjectService,
    ],
    exports: [
        ProjectService,
    ],
})
export class ProjectModule { }
