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
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@ApiTags('Projects')
@Controller('projects')
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    type: StructuredResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Assigned agent (if provided) or project type not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Project with this name already exists',
  })
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<StructuredResponse> {
    return await this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all projects with pagination and optional filtering',
  })
  @ApiQuery({
    name: 'assignedAgentId',
    required: false,
    description: 'Filter projects by assigned agent ID',
    type: String,
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter projects by customer ID',
    type: String,
  })
  @ApiQuery({
    name: 'projectTypeId',
    required: false,
    description: 'Filter projects by project type ID',
    type: String,
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
    description: 'Paginated list of projects',
    type: StructuredResponse,
  })
  async findAll(
    @Query('assignedAgentId') assignedAgentId?: string,
    @Query('customerId') customerId?: string,
    @Query('projectTypeId') projectTypeId?: string,
    @Query() queryParams?: QueryParams,
  ): Promise<StructuredResponse> {
    const page = queryParams?.page || 1;
    const pageSize = queryParams?.pageSize || 10;

    if (assignedAgentId) {
      return await this.projectService.findByAssignedAgentPaginated(
        assignedAgentId,
        page,
        pageSize,
      );
    } else if (customerId) {
      return await this.projectService.findByCustomerPaginated(
        customerId,
        page,
        pageSize,
      );
    } else if (projectTypeId) {
      return await this.projectService.findByProjectTypePaginated(
        projectTypeId,
        page,
        pageSize,
      );
    } else {
      return await this.projectService.findAllPaginated(page, pageSize);
    }
  }

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'Get all projects assigned to a specific agent' })
  @ApiParam({ name: 'agentId', description: 'Agent UUID' })
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
    description: 'Projects assigned to agent',
    type: StructuredResponse,
  })
  async findByAgent(
    @Param('agentId', ParseUUIDPipe) agentId: string,
    @Query() queryParams?: QueryParams,
  ): Promise<StructuredResponse> {
    const page = queryParams?.page || 1;
    const pageSize = queryParams?.pageSize || 10;
    return await this.projectService.findByAssignedAgentPaginated(
      agentId,
      page,
      pageSize,
    );
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all projects for a specific customer' })
  @ApiParam({ name: 'customerId', description: 'Customer UUID' })
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
    description: 'Projects for customer',
    type: StructuredResponse,
  })
  async findByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query() queryParams?: QueryParams,
  ): Promise<StructuredResponse> {
    const page = queryParams?.page || 1;
    const pageSize = queryParams?.pageSize || 10;
    return await this.projectService.findByCustomerPaginated(
      customerId,
      page,
      pageSize,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({
    status: 200,
    description: 'Project found',
    type: StructuredResponse,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StructuredResponse> {
    return await this.projectService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    type: StructuredResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Project, assigned agent, or project type not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Project with this name already exists',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<StructuredResponse> {
    return await this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    type: StructuredResponse,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StructuredResponse> {
    return await this.projectService.remove(id);
  }
}
