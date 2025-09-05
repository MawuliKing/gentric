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
import { QueryParams } from '../../utils/dto/query-params.dto';
import { StructuredResponse } from '../../utils/dto/structured-response.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@ApiTags('Projects')
@Controller('projects')
@ApiBearerAuth()
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({
        status: 201,
        description: 'Project created successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Assigned agent (if provided) or project type not found' })
    @ApiResponse({ status: 409, description: 'Project with this name already exists' })
    async create(@Body() createProjectDto: CreateProjectDto): Promise<StructuredResponse> {
        return await this.projectService.create(createProjectDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all projects with pagination and optional filtering' })
    @ApiQuery({
        name: 'assignedAgentId',
        required: false,
        description: 'Filter projects by assigned agent ID',
        type: String
    })
    @ApiQuery({
        name: 'projectTypeId',
        required: false,
        description: 'Filter projects by project type ID',
        type: String
    })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Items per page (default: 10)', example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of projects',
        type: StructuredResponse
    })
    async findAll(
        @Query('assignedAgentId') assignedAgentId?: string,
        @Query('projectTypeId') projectTypeId?: string,
        @Query() queryParams?: QueryParams
    ): Promise<StructuredResponse> {
        const page = queryParams?.page || 1;
        const pageSize = queryParams?.pageSize || 10;

        if (assignedAgentId) {
            return await this.projectService.findByAssignedAgentPaginated(assignedAgentId, page, pageSize);
        } else if (projectTypeId) {
            return await this.projectService.findByProjectTypePaginated(projectTypeId, page, pageSize);
        } else {
            return await this.projectService.findAllPaginated(page, pageSize);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a project by ID' })
    @ApiParam({ name: 'id', description: 'Project UUID' })
    @ApiResponse({
        status: 200,
        description: 'Project found',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        return await this.projectService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a project' })
    @ApiParam({ name: 'id', description: 'Project UUID' })
    @ApiResponse({
        status: 200,
        description: 'Project updated successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Project, assigned agent, or project type not found' })
    @ApiResponse({ status: 409, description: 'Project with this name already exists' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProjectDto: UpdateProjectDto
    ): Promise<StructuredResponse> {
        return await this.projectService.update(id, updateProjectDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project' })
    @ApiParam({ name: 'id', description: 'Project UUID' })
    @ApiResponse({
        status: 200,
        description: 'Project deleted successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        return await this.projectService.remove(id);
    }
}
