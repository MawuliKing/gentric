import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportSubmissionEntity } from '../../database/entities/report-submission.entity';
import { ProjectsEntity } from '../../database/entities/project.entity';
import { ReportTemplatesEntity } from '../../database/entities/report-templates.entity';
import {
  CreateReportSubmissionDto,
  UpdateReportSubmissionDto,
  ApproveReportDto,
} from './dto/report-submission.dto';
import { StructuredResponse } from '../../utils/dto/structured-response.dto';
import { REPORT_STATUS } from '../../utils/generics/enums';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportSubmissionEntity)
    private readonly reportSubmissionRepository: Repository<ReportSubmissionEntity>,
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
    @InjectRepository(ReportTemplatesEntity)
    private readonly reportTemplatesRepository: Repository<ReportTemplatesEntity>,
  ) {}

  async create(
    createReportSubmissionDto: CreateReportSubmissionDto,
  ): Promise<StructuredResponse> {
    // Verify project exists
    const project = await this.projectsRepository.findOne({
      where: { id: createReportSubmissionDto.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${createReportSubmissionDto.projectId} not found`,
      );
    }

    // Verify report template exists
    const reportTemplate = await this.reportTemplatesRepository.findOne({
      where: { id: createReportSubmissionDto.reportTemplateId },
    });

    if (!reportTemplate) {
      throw new NotFoundException(
        `Report template with ID ${createReportSubmissionDto.reportTemplateId} not found`,
      );
    }

    // Check if a report submission already exists for this project and template
    const existingSubmission = await this.reportSubmissionRepository.findOne({
      where: {
        project: { id: createReportSubmissionDto.projectId },
        reportTemplate: { id: createReportSubmissionDto.reportTemplateId },
      },
    });

    if (existingSubmission) {
      throw new ConflictException(
        'A report submission already exists for this project and template',
      );
    }

    const reportSubmission = this.reportSubmissionRepository.create({
      reportData: createReportSubmissionDto.reportData,
      status: createReportSubmissionDto.status || REPORT_STATUS.DRAFT,
      project,
      reportTemplate,
    });

    const savedSubmission =
      await this.reportSubmissionRepository.save(reportSubmission);

    return {
      status: true,
      statusCode: 201,
      message: 'Report submission created successfully',
      payload: savedSubmission,
    };
  }

  async findAll(): Promise<StructuredResponse> {
    const submissions = await this.reportSubmissionRepository.find({
      relations: ['project', 'reportTemplate'],
      order: { createdAt: 'DESC' },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Report submissions retrieved successfully',
      payload: submissions,
    };
  }

  async findAllPaginated(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<StructuredResponse> {
    const [data, total] = await this.reportSubmissionRepository.findAndCount({
      relations: ['project', 'reportTemplate'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      status: true,
      statusCode: 200,
      message: 'Report submissions retrieved successfully',
      payload: data,
      total,
      totalPages,
    };
  }

  async findByProject(projectId: string): Promise<StructuredResponse> {
    const submissions = await this.reportSubmissionRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'reportTemplate'],
      order: { createdAt: 'DESC' },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Report submissions retrieved successfully',
      payload: submissions,
    };
  }

  async findByProjectPaginated(
    projectId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<StructuredResponse> {
    // Verify project exists
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const [data, total] = await this.reportSubmissionRepository.findAndCount({
      where: { project: { id: projectId } },
      relations: ['project', 'reportTemplate'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      status: true,
      statusCode: 200,
      message: 'Report submissions retrieved successfully',
      payload: data,
      total,
      totalPages,
    };
  }

  async findByStatus(status: REPORT_STATUS): Promise<StructuredResponse> {
    const submissions = await this.reportSubmissionRepository.find({
      where: { status },
      relations: ['project', 'reportTemplate'],
      order: { createdAt: 'DESC' },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Report submissions retrieved successfully',
      payload: submissions,
    };
  }

  async findByStatusPaginated(
    status: REPORT_STATUS,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<StructuredResponse> {
    const [data, total] = await this.reportSubmissionRepository.findAndCount({
      where: { status },
      relations: ['project', 'reportTemplate'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      status: true,
      statusCode: 200,
      message: 'Report submissions retrieved successfully',
      payload: data,
      total,
      totalPages,
    };
  }

  async findOne(id: string): Promise<StructuredResponse> {
    const submission = await this.reportSubmissionRepository.findOne({
      where: { id },
      relations: ['project', 'reportTemplate'],
    });

    if (!submission) {
      throw new NotFoundException(`Report submission with ID ${id} not found`);
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Report submission retrieved successfully',
      payload: submission,
    };
  }

  async update(
    id: string,
    updateReportSubmissionDto: UpdateReportSubmissionDto,
  ): Promise<StructuredResponse> {
    const submission = await this.reportSubmissionRepository.findOne({
      where: { id },
      relations: ['project', 'reportTemplate'],
    });

    if (!submission) {
      throw new NotFoundException(`Report submission with ID ${id} not found`);
    }

    // Prevent updating approved or rejected reports
    if (
      submission.status === REPORT_STATUS.APPROVED ||
      submission.status === REPORT_STATUS.REJECTED
    ) {
      throw new BadRequestException(
        'Cannot update approved or rejected report submissions',
      );
    }

    Object.assign(submission, updateReportSubmissionDto);
    const updatedSubmission =
      await this.reportSubmissionRepository.save(submission);

    return {
      status: true,
      statusCode: 200,
      message: 'Report submission updated successfully',
      payload: updatedSubmission,
    };
  }

  async approve(
    id: string,
    approveReportDto: ApproveReportDto,
  ): Promise<StructuredResponse> {
    const submission = await this.reportSubmissionRepository.findOne({
      where: { id },
      relations: ['project', 'reportTemplate'],
    });

    if (!submission) {
      throw new NotFoundException(`Report submission with ID ${id} not found`);
    }

    // Only allow approval of submitted reports
    if (submission.status !== REPORT_STATUS.SUBMITTED) {
      throw new BadRequestException('Only submitted reports can be approved');
    }

    submission.status = REPORT_STATUS.APPROVED;
    if (approveReportDto.comments) {
      // You might want to add a comments field to the entity
      // For now, we'll store it in reportData
      submission.reportData = {
        ...submission.reportData,
        approvalComments: approveReportDto.comments,
        approvedAt: new Date().toISOString(),
      };
    }

    const approvedSubmission =
      await this.reportSubmissionRepository.save(submission);

    return {
      status: true,
      statusCode: 200,
      message: 'Report submission approved successfully',
      payload: approvedSubmission,
    };
  }

  async reject(
    id: string,
    approveReportDto: ApproveReportDto,
  ): Promise<StructuredResponse> {
    const submission = await this.reportSubmissionRepository.findOne({
      where: { id },
      relations: ['project', 'reportTemplate'],
    });

    if (!submission) {
      throw new NotFoundException(`Report submission with ID ${id} not found`);
    }

    // Only allow rejection of submitted reports
    if (submission.status !== REPORT_STATUS.SUBMITTED) {
      throw new BadRequestException('Only submitted reports can be rejected');
    }

    submission.status = REPORT_STATUS.REJECTED;
    if (approveReportDto.comments) {
      // You might want to add a comments field to the entity
      // For now, we'll store it in reportData
      submission.reportData = {
        ...submission.reportData,
        rejectionComments: approveReportDto.comments,
        rejectedAt: new Date().toISOString(),
      };
    }

    const rejectedSubmission =
      await this.reportSubmissionRepository.save(submission);

    return {
      status: true,
      statusCode: 200,
      message: 'Report submission rejected successfully',
      payload: rejectedSubmission,
    };
  }

  async remove(id: string): Promise<StructuredResponse> {
    const submission = await this.reportSubmissionRepository.findOne({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(`Report submission with ID ${id} not found`);
    }

    // Prevent deletion of approved or rejected reports
    if (
      submission.status === REPORT_STATUS.APPROVED ||
      submission.status === REPORT_STATUS.REJECTED
    ) {
      throw new BadRequestException(
        'Cannot delete approved or rejected report submissions',
      );
    }

    await this.reportSubmissionRepository.remove(submission);

    return {
      status: true,
      statusCode: 200,
      message: 'Report submission deleted successfully',
      payload: null,
    };
  }
}
