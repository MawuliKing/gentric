import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryParams } from '../../utils/dto/query-params.dto';
import { StructuredResponse } from '../../utils/dto/structured-response.dto';
import {
  CreateReportSubmissionDto,
  UpdateReportSubmissionDto,
  ApproveReportDto,
} from './dto/report-submission.dto';
import { ReportsService } from './reports.service';
import { REPORT_STATUS } from '../../utils/generics/enums';

@ApiTags('Report Submissions')
@Controller('reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report submission' })
  @ApiResponse({
    status: 201,
    description: 'Report submission created successfully',
    type: StructuredResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Project or report template not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Report submission already exists for this project and template',
  })
  async create(
    @Body() createReportSubmissionDto: CreateReportSubmissionDto,
  ): Promise<StructuredResponse> {
    return await this.reportsService.create(createReportSubmissionDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all report submissions with pagination and optional filtering',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter reports by status',
    enum: REPORT_STATUS,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of report submissions',
    type: StructuredResponse,
  })
  async findAll(
    @Query('status') status?: REPORT_STATUS,
    @Query() queryParams?: QueryParams,
  ): Promise<StructuredResponse> {
    const page = queryParams?.page || 1;
    const pageSize = queryParams?.pageSize || 10;

    if (status) {
      return await this.reportsService.findByStatusPaginated(
        status,
        page,
        pageSize,
      );
    } else {
      return await this.reportsService.findAllPaginated(page, pageSize);
    }
  }

  @Get('project/:projectId')
  @ApiOperation({
    summary: 'Get all report submissions for a specific project',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Report submissions for project',
    type: StructuredResponse,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() queryParams?: QueryParams,
  ): Promise<StructuredResponse> {
    const page = queryParams?.page || 1;
    const pageSize = queryParams?.pageSize || 10;
    return await this.reportsService.findByProjectPaginated(
      projectId,
      page,
      pageSize,
    );
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get all report submissions by status' })
  @ApiParam({
    name: 'status',
    description: 'Report status',
    enum: REPORT_STATUS,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Report submissions by status',
    type: StructuredResponse,
  })
  async findByStatus(
    @Param('status') status: REPORT_STATUS,
    @Query() queryParams?: QueryParams,
  ): Promise<StructuredResponse> {
    const page = queryParams?.page || 1;
    const pageSize = queryParams?.pageSize || 10;
    return await this.reportsService.findByStatusPaginated(
      status,
      page,
      pageSize,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report submission by ID' })
  @ApiParam({ name: 'id', description: 'Report submission UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report submission found',
    type: StructuredResponse,
  })
  @ApiResponse({ status: 404, description: 'Report submission not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StructuredResponse> {
    return await this.reportsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a report submission' })
  @ApiParam({ name: 'id', description: 'Report submission UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report submission updated successfully',
    type: StructuredResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Report submission not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot update approved or rejected reports',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReportSubmissionDto: UpdateReportSubmissionDto,
  ): Promise<StructuredResponse> {
    return await this.reportsService.update(id, updateReportSubmissionDto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a report submission' })
  @ApiParam({ name: 'id', description: 'Report submission UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report submission approved successfully',
    type: StructuredResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Report submission not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Only submitted reports can be approved',
  })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approveReportDto: ApproveReportDto,
  ): Promise<StructuredResponse> {
    return await this.reportsService.approve(id, approveReportDto);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a report submission' })
  @ApiParam({ name: 'id', description: 'Report submission UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report submission rejected successfully',
    type: StructuredResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Report submission not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Only submitted reports can be rejected',
  })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approveReportDto: ApproveReportDto,
  ): Promise<StructuredResponse> {
    return await this.reportsService.reject(id, approveReportDto);
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit a report for approval' })
  @ApiParam({ name: 'id', description: 'Report submission UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report submitted for approval successfully',
    type: StructuredResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Report submission not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Only draft reports can be submitted for approval',
  })
  async submitForApproval(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StructuredResponse> {
    return await this.reportsService.submitForApproval(id);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get report submission statistics' })
  @ApiResponse({
    status: 200,
    description: 'Report statistics retrieved successfully',
    type: StructuredResponse,
  })
  async getStatistics(): Promise<StructuredResponse> {
    return await this.reportsService.getReportStatistics();
  }

  @Get('project/:projectId/status/:status')
  @ApiOperation({
    summary: 'Get reports by project ID and status',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiParam({
    name: 'status',
    description: 'Report status',
    enum: REPORT_STATUS,
  })
  @ApiResponse({
    status: 200,
    description: 'Report submissions retrieved successfully',
    type: StructuredResponse,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getReportsByProjectAndStatus(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('status') status: REPORT_STATUS,
  ): Promise<StructuredResponse> {
    return await this.reportsService.getReportsByProjectAndStatus(
      projectId,
      status,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report submission' })
  @ApiParam({ name: 'id', description: 'Report submission UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report submission deleted successfully',
    type: StructuredResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Report submission not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete approved or rejected reports',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StructuredResponse> {
    return await this.reportsService.remove(id);
  }
}
