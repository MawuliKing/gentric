import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypesEntity } from '../../../database/entities/project-types.entity';
import { CreateProjectTypeDto, UpdateProjectTypeDto } from '../dto/project-type.dto';
import { StructuredResponse } from '../../../utils/dto/structured-response.dto';

@Injectable()
export class ProjectTypeService {
    constructor(
        @InjectRepository(ProjectTypesEntity)
        private readonly projectTypesRepository: Repository<ProjectTypesEntity>,
    ) { }

    async create(createProjectTypeDto: CreateProjectTypeDto): Promise<StructuredResponse> {
        // Check if project type with same name already exists
        const existingProjectType = await this.projectTypesRepository.findOne({
            where: { name: createProjectTypeDto.name },
        });

        if (existingProjectType) {
            throw new ConflictException('Project type with this name already exists');
        }

        const projectType = this.projectTypesRepository.create(createProjectTypeDto);
        const savedProjectType = await this.projectTypesRepository.save(projectType);

        return {
            status: true,
            statusCode: 201,
            message: 'Project type created successfully',
            payload: savedProjectType
        };
    }

    async findAll(): Promise<ProjectTypesEntity[]> {
        return await this.projectTypesRepository.find({
            relations: ['reports'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAllPaginated(page: number = 1, pageSize: number = 10): Promise<StructuredResponse> {
        const [data, total] = await this.projectTypesRepository.findAndCount({
            relations: ['reports'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const totalPages = Math.ceil(total / pageSize);

        return {
            status: true,
            statusCode: 200,
            message: 'Project types retrieved successfully',
            payload: data,
            total,
            totalPages
        };
    }

    async findOne(id: string): Promise<StructuredResponse> {
        const projectType = await this.projectTypesRepository.findOne({
            where: { id },
            relations: ['reports'],
        });

        if (!projectType) {
            throw new NotFoundException(`Project type with ID ${id} not found`);
        }

        return {
            status: true,
            statusCode: 200,
            message: 'Project type retrieved successfully',
            payload: projectType
        };
    }

    async update(id: string, updateProjectTypeDto: UpdateProjectTypeDto): Promise<StructuredResponse> {
        const projectType = await this.projectTypesRepository.findOne({
            where: { id },
            relations: ['reports'],
        });

        if (!projectType) {
            throw new NotFoundException(`Project type with ID ${id} not found`);
        }

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
        const updatedProjectType = await this.projectTypesRepository.save(projectType);

        return {
            status: true,
            statusCode: 200,
            message: 'Project type updated successfully',
            payload: updatedProjectType
        };
    }

    async remove(id: string): Promise<StructuredResponse> {
        const projectType = await this.projectTypesRepository.findOne({
            where: { id },
        });

        if (!projectType) {
            throw new NotFoundException(`Project type with ID ${id} not found`);
        }

        await this.projectTypesRepository.remove(projectType);

        return {
            status: true,
            statusCode: 200,
            message: 'Project type deleted successfully',
            payload: null
        };
    }

    async findByName(name: string): Promise<ProjectTypesEntity | null> {
        return await this.projectTypesRepository.findOne({
            where: { name },
        });
    }
}
