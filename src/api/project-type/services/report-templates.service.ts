import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportTemplatesEntity } from '../../../database/entities/report-templates.entity';
import { ProjectTypesEntity } from '../../../database/entities/project-types.entity';
import { CreateReportTemplateDto, UpdateReportTemplateDto } from '../dto/report-template.dto';
import { StructuredResponse } from '../../../utils/dto/structured-response.dto';

@Injectable()
export class ReportTemplatesService {
    constructor(
        @InjectRepository(ReportTemplatesEntity)
        private readonly reportTemplatesRepository: Repository<ReportTemplatesEntity>,
        @InjectRepository(ProjectTypesEntity)
        private readonly projectTypesRepository: Repository<ProjectTypesEntity>,
    ) { }

    async create(createReportTemplateDto: CreateReportTemplateDto): Promise<StructuredResponse> {
        // Verify project type exists
        const projectType = await this.projectTypesRepository.findOne({
            where: { id: createReportTemplateDto.projectTypeId },
        });

        if (!projectType) {
            throw new NotFoundException(`Project type with ID ${createReportTemplateDto.projectTypeId} not found`);
        }

        // Check if template with same name already exists for this project type
        const existingTemplate = await this.reportTemplatesRepository.findOne({
            where: {
                name: createReportTemplateDto.name,
                projectType: { id: createReportTemplateDto.projectTypeId }
            },
        });

        if (existingTemplate) {
            throw new ConflictException('Report template with this name already exists for this project type');
        }

        const reportTemplate = this.reportTemplatesRepository.create({
            ...createReportTemplateDto,
            projectType,
        });

        const savedTemplate = await this.reportTemplatesRepository.save(reportTemplate);

        return {
            status: true,
            statusCode: 201,
            message: 'Report template created successfully',
            payload: savedTemplate
        };
    }

    async findAll(): Promise<ReportTemplatesEntity[]> {
        return await this.reportTemplatesRepository.find({
            relations: ['projectType'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAllPaginated(page: number = 1, pageSize: number = 10): Promise<StructuredResponse> {
        const [data, total] = await this.reportTemplatesRepository.findAndCount({
            relations: ['projectType'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const totalPages = Math.ceil(total / pageSize);

        return {
            status: true,
            statusCode: 200,
            message: 'Report templates retrieved successfully',
            payload: data,
            total,
            totalPages
        };
    }

    async findByProjectType(projectTypeId: string): Promise<ReportTemplatesEntity[]> {
        return await this.reportTemplatesRepository.find({
            where: { projectType: { id: projectTypeId } },
            relations: ['projectType'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByProjectTypePaginated(projectTypeId: string, page: number = 1, pageSize: number = 10): Promise<StructuredResponse> {
        const [data, total] = await this.reportTemplatesRepository.findAndCount({
            where: { projectType: { id: projectTypeId } },
            relations: ['projectType'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const totalPages = Math.ceil(total / pageSize);

        return {
            status: true,
            statusCode: 200,
            message: 'Report templates retrieved successfully',
            payload: data,
            total,
            totalPages
        };
    }

    async findOne(id: string): Promise<StructuredResponse> {
        const reportTemplate = await this.reportTemplatesRepository.findOne({
            where: { id },
            relations: ['projectType'],
        });

        if (!reportTemplate) {
            throw new NotFoundException(`Report template with ID ${id} not found`);
        }

        return {
            status: true,
            statusCode: 200,
            message: 'Report template retrieved successfully',
            payload: reportTemplate
        };
    }

    async update(id: string, updateReportTemplateDto: UpdateReportTemplateDto): Promise<StructuredResponse> {
        const reportTemplate = await this.reportTemplatesRepository.findOne({
            where: { id },
            relations: ['projectType'],
        });

        if (!reportTemplate) {
            throw new NotFoundException(`Report template with ID ${id} not found`);
        }

        // If project type is being updated, verify it exists
        if (updateReportTemplateDto.projectTypeId) {
            const projectType = await this.projectTypesRepository.findOne({
                where: { id: updateReportTemplateDto.projectTypeId },
            });

            if (!projectType) {
                throw new NotFoundException(`Project type with ID ${updateReportTemplateDto.projectTypeId} not found`);
            }
        }

        // Check if name is being updated and if it conflicts with existing names
        if (updateReportTemplateDto.name && updateReportTemplateDto.name !== reportTemplate.name) {
            const projectTypeId = updateReportTemplateDto.projectTypeId || reportTemplate.projectType.id;

            const existingTemplate = await this.reportTemplatesRepository.findOne({
                where: {
                    name: updateReportTemplateDto.name,
                    projectType: { id: projectTypeId }
                },
            });

            if (existingTemplate) {
                throw new ConflictException('Report template with this name already exists for this project type');
            }
        }

        Object.assign(reportTemplate, updateReportTemplateDto);
        const updatedTemplate = await this.reportTemplatesRepository.save(reportTemplate);

        return {
            status: true,
            statusCode: 200,
            message: 'Report template updated successfully',
            payload: updatedTemplate
        };
    }

    async remove(id: string): Promise<StructuredResponse> {
        const reportTemplate = await this.reportTemplatesRepository.findOne({
            where: { id },
        });

        if (!reportTemplate) {
            throw new NotFoundException(`Report template with ID ${id} not found`);
        }

        await this.reportTemplatesRepository.remove(reportTemplate);

        return {
            status: true,
            statusCode: 200,
            message: 'Report template deleted successfully',
            payload: null
        };
    }

    async findByName(name: string, projectTypeId?: string): Promise<ReportTemplatesEntity | null> {
        const whereCondition: any = { name };

        if (projectTypeId) {
            whereCondition.projectType = { id: projectTypeId };
        }

        return await this.reportTemplatesRepository.findOne({
            where: whereCondition,
            relations: ['projectType'],
        });
    }
}
