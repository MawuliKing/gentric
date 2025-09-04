import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypesEntity } from '../../../database/entities/project-types.entity';
import { CreateProjectTypeDto, UpdateProjectTypeDto } from '../dto/project-type.dto';

@Injectable()
export class ProjectTypeService {
    constructor(
        @InjectRepository(ProjectTypesEntity)
        private readonly projectTypesRepository: Repository<ProjectTypesEntity>,
    ) { }

    async create(createProjectTypeDto: CreateProjectTypeDto): Promise<ProjectTypesEntity> {
        // Check if project type with same name already exists
        const existingProjectType = await this.projectTypesRepository.findOne({
            where: { name: createProjectTypeDto.name },
        });

        if (existingProjectType) {
            throw new ConflictException('Project type with this name already exists');
        }

        const projectType = this.projectTypesRepository.create(createProjectTypeDto);
        return await this.projectTypesRepository.save(projectType);
    }

    async findAll(): Promise<ProjectTypesEntity[]> {
        return await this.projectTypesRepository.find({
            relations: ['reports'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAllPaginated(page: number = 1, pageSize: number = 10): Promise<{
        data: ProjectTypesEntity[];
        total: number;
        totalPages: number;
    }> {
        const [data, total] = await this.projectTypesRepository.findAndCount({
            relations: ['reports'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const totalPages = Math.ceil(total / pageSize);

        return {
            data,
            total,
            totalPages,
        };
    }

    async findOne(id: string): Promise<ProjectTypesEntity> {
        const projectType = await this.projectTypesRepository.findOne({
            where: { id },
            relations: ['reports'],
        });

        if (!projectType) {
            throw new NotFoundException(`Project type with ID ${id} not found`);
        }

        return projectType;
    }

    async update(id: string, updateProjectTypeDto: UpdateProjectTypeDto): Promise<ProjectTypesEntity> {
        const projectType = await this.findOne(id);

        // Check if name is being updated and if it conflicts with existing names
        if (updateProjectTypeDto.name && updateProjectTypeDto.name !== projectType.name) {
            const existingProjectType = await this.projectTypesRepository.findOne({
                where: { name: updateProjectTypeDto.name },
            });

            if (existingProjectType) {
                throw new ConflictException('Project type with this name already exists');
            }
        }

        Object.assign(projectType, updateProjectTypeDto);
        return await this.projectTypesRepository.save(projectType);
    }

    async remove(id: string): Promise<void> {
        const projectType = await this.findOne(id);
        await this.projectTypesRepository.remove(projectType);
    }

    async findByName(name: string): Promise<ProjectTypesEntity | null> {
        return await this.projectTypesRepository.findOne({
            where: { name },
        });
    }
}
