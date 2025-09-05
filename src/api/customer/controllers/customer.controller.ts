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
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';
import { CustomerService } from '../services/customer.service';

@ApiTags('Customers')
@Controller('customers')
@ApiBearerAuth()
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new customer' })
    @ApiResponse({
        status: 201,
        description: 'Customer created successfully. Password sent to email.',
        type: StructuredResponse
    })
    @ApiResponse({ status: 409, description: 'Customer with this email already exists' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async create(@Body() createCustomerDto: CreateCustomerDto): Promise<StructuredResponse> {
        return await this.customerService.create(createCustomerDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all customers with pagination' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Items per page (default: 10)', example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of customers',
        type: StructuredResponse
    })
    async findAll(@Query() queryParams: QueryParams): Promise<StructuredResponse> {
        return await this.customerService.findAllPaginated(
            queryParams.page,
            queryParams.pageSize
        );
    }

    @Get('all')
    @ApiOperation({ summary: 'Get all customers without pagination' })
    @ApiResponse({
        status: 200,
        description: 'List of all customers',
        type: StructuredResponse
    })
    async findAllWithoutPagination(): Promise<StructuredResponse> {
        return await this.customerService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a customer by ID' })
    @ApiParam({ name: 'id', description: 'Customer UUID' })
    @ApiResponse({
        status: 200,
        description: 'Customer found',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        return await this.customerService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a customer' })
    @ApiParam({ name: 'id', description: 'Customer UUID' })
    @ApiResponse({
        status: 200,
        description: 'Customer updated successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    @ApiResponse({ status: 409, description: 'Customer with this email already exists' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCustomerDto: UpdateCustomerDto
    ): Promise<StructuredResponse> {
        return await this.customerService.update(id, updateCustomerDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a customer' })
    @ApiParam({ name: 'id', description: 'Customer UUID' })
    @ApiResponse({
        status: 200,
        description: 'Customer deleted successfully',
        type: StructuredResponse
    })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<StructuredResponse> {
        return await this.customerService.remove(id);
    }
}
