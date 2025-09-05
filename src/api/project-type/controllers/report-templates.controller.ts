import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryParams } from '../../../utils/dto/query-params.dto';
import { StructuredResponse } from '../../../utils/dto/structured-response.dto';
import { CreateReportTemplateDto, UpdateReportTemplateDto } from '../dto/report-template.dto';
import { ReportTemplatesService } from '../services/report-templates.service';

@ApiTags('Report Templates')
@Controller('report-templates')
@ApiBearerAuth()
export class ReportTemplatesController {
    constructor(private readonly reportTemplatesService: ReportTemplatesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new report template' })
    @ApiResponse({
        status: 201,
        description: 'Report template created successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Project type not found' })
    @ApiResponse({ status: 409, description: 'Report template with this name already exists for this project type' })
    async create(@Body() createReportTemplateDto: CreateReportTemplateDto): Promise<StructuredResponse> {
        return await this.reportTemplatesService.create(createReportTemplateDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all report templates with pagination and optional filtering' })
    @ApiQuery({
        name: 'projectTypeId',
        required: false,
        description: 'Filter templates by project type ID',
        type: String
    })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Items per page (default: 10)', example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of report templates',
        type: StructuredResponse
    })
    async findAll(
        @Query('projectTypeId') projectTypeId?: string,
        @Query() queryParams?: QueryParams
    ): Promise<StructuredResponse> {
        const page = queryParams?.page || 1;
        const pageSize = queryParams?.pageSize || 10;

        return projectTypeId
            ? await this.reportTemplatesService.findByProjectTypePaginated(projectTypeId, page, pageSize)
            : await this.reportTemplatesService.findAllPaginated(page, pageSize);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a report template by ID' })
    @ApiParam({ name: 'id', description: 'Report template UUID' })
    @ApiResponse({
        status: 200,
        description: 'Report template found',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Report template not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        return await this.reportTemplatesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a report template' })
    @ApiParam({ name: 'id', description: 'Report template UUID' })
    @ApiResponse({
        status: 200,
        description: 'Report template updated successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Report template or project type not found' })
    @ApiResponse({ status: 409, description: 'Report template with this name already exists for this project type' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateReportTemplateDto: UpdateReportTemplateDto
    ): Promise<StructuredResponse> {
        return await this.reportTemplatesService.update(id, updateReportTemplateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a report template' })
    @ApiParam({ name: 'id', description: 'Report template UUID' })
    @ApiResponse({
        status: 200,
        description: 'Report template deleted successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Report template not found' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        return await this.reportTemplatesService.remove(id);
    }
}
