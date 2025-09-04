import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
    Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectTypeService } from '../services/project-type.service';
import { CreateProjectTypeDto, UpdateProjectTypeDto } from '../dto/project-type.dto';
import { ProjectTypesEntity } from '../../../database/entities/project-types.entity';
import { StructuredResponse } from '../../../utils/dto/structured-response.dto';
import { QueryParams } from '../../../utils/dto/query-params.dto';

@ApiTags('Project Types')
@Controller('project-types')
@ApiBearerAuth()
export class ProjectTypeController {
    constructor(private readonly projectTypeService: ProjectTypeService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project type' })
    @ApiResponse({
        status: 201,
        description: 'Project type created successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 409, description: 'Project type with this name already exists' })
    async create(@Body() createProjectTypeDto: CreateProjectTypeDto): Promise<StructuredResponse> {
        const data = await this.projectTypeService.create(createProjectTypeDto);
        return {
            status: true,
            statusCode: 201,
            message: 'Project type created successfully',
            payload: data
        };
    }

    @Get()
    @ApiOperation({ summary: 'Get all project types with pagination' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Items per page (default: 10)', example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of project types',
        type: StructuredResponse
    })
    async findAll(@Query() queryParams: QueryParams): Promise<StructuredResponse> {
        const { data, total, totalPages } = await this.projectTypeService.findAllPaginated(
            queryParams.page,
            queryParams.pageSize
        );
        return {
            status: true,
            statusCode: 200,
            message: 'Project types retrieved successfully',
            payload: data,
            total,
            totalPages
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a project type by ID' })
    @ApiParam({ name: 'id', description: 'Project type UUID' })
    @ApiResponse({
        status: 200,
        description: 'Project type found',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Project type not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        const data = await this.projectTypeService.findOne(id);
        return {
            status: true,
            statusCode: 200,
            message: 'Project type retrieved successfully',
            payload: data
        };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a project type' })
    @ApiParam({ name: 'id', description: 'Project type UUID' })
    @ApiResponse({
        status: 200,
        description: 'Project type updated successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Project type not found' })
    @ApiResponse({ status: 409, description: 'Project type with this name already exists' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProjectTypeDto: UpdateProjectTypeDto
    ): Promise<StructuredResponse> {
        const data = await this.projectTypeService.update(id, updateProjectTypeDto);
        return {
            status: true,
            statusCode: 200,
            message: 'Project type updated successfully',
            payload: data
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project type' })
    @ApiParam({ name: 'id', description: 'Project type UUID' })
    @ApiResponse({
        status: 200,
        description: 'Project type deleted successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Project type not found' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        await this.projectTypeService.remove(id);
        return {
            status: true,
            statusCode: 200,
            message: 'Project type deleted successfully',
            payload: null
        };
    }
}
