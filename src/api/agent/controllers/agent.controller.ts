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
import { CreateAgentDto, UpdateAgentDto } from '../dto/agent.dto';
import { AgentService } from '../services/agent.service';

@ApiTags('Agents')
@Controller('agents')
@ApiBearerAuth()
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new agent' })
    @ApiResponse({
        status: 201,
        description: 'Agent created successfully. Password sent to email.',
        type: StructuredResponse
    })
    @ApiResponse({ status: 409, description: 'Agent with this email already exists' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async create(@Body() createAgentDto: CreateAgentDto): Promise<StructuredResponse> {
        return await this.agentService.create(createAgentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all agents with pagination' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Items per page (default: 10)', example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of agents',
        type: StructuredResponse
    })
    async findAll(@Query() queryParams: QueryParams): Promise<StructuredResponse> {
        return await this.agentService.findAllPaginated(
            queryParams.page,
            queryParams.pageSize
        );
    }

    @Get('all')
    @ApiOperation({ summary: 'Get all agents without pagination' })
    @ApiResponse({
        status: 200,
        description: 'List of all agents',
        type: StructuredResponse
    })
    async findAllWithoutPagination(): Promise<StructuredResponse> {
        return await this.agentService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an agent by ID' })
    @ApiParam({ name: 'id', description: 'Agent UUID' })
    @ApiResponse({
        status: 200,
        description: 'Agent found',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Agent not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        return await this.agentService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an agent' })
    @ApiParam({ name: 'id', description: 'Agent UUID' })
    @ApiResponse({
        status: 200,
        description: 'Agent updated successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Agent not found' })
    @ApiResponse({ status: 409, description: 'Agent with this email already exists' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateAgentDto: UpdateAgentDto
    ): Promise<StructuredResponse> {
        return await this.agentService.update(id, updateAgentDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an agent' })
    @ApiParam({ name: 'id', description: 'Agent UUID' })
    @ApiResponse({
        status: 200,
        description: 'Agent deleted successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Agent not found' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        return await this.agentService.remove(id);
    }
}
