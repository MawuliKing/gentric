import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentityEntity } from '../../../database/entities/identity.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';
import { StructuredResponse } from '../../../utils/dto/structured-response.dto';
import { EmailService } from '../../email/email.service';
import { ACCOUNT_TYPE, ACCOUNT_STATUS } from '../../../utils/generics/enums';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(IdentityEntity)
    private readonly identityRepository: Repository<IdentityEntity>,
    private readonly emailService: EmailService,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<StructuredResponse> {
    // Check if customer with same email already exists
    const existingCustomer = await this.identityRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }

    // Generate a random password
    const generatedPassword = 'password'; // this.generatePassword();

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create customer
    const customer = this.identityRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
      emailVerificationToken,
      type: ACCOUNT_TYPE.CUSTOMER,
      status: ACCOUNT_STATUS.ACTIVE,
      isEmailVerified: false,
    });

    const savedCustomer = await this.identityRepository.save(customer);

    // Send password email
    try {
      await this.emailService.sendPasswordEmail(
        savedCustomer.email,
        savedCustomer.firstName,
        generatedPassword,
        'customer',
      );
    } catch (error) {
      console.error('Failed to send password email:', error);
      // Don't throw error here, customer is still created successfully
    }

    // Remove sensitive data from response
    const {
      password,
      emailVerificationToken: _,
      ...customerResponse
    } = savedCustomer;

    return {
      status: true,
      statusCode: 201,
      message: 'Customer created successfully. Password sent to email.',
      payload: customerResponse,
    };
  }

  async findAll(): Promise<StructuredResponse> {
    const customers = await this.identityRepository.find({
      where: { type: ACCOUNT_TYPE.CUSTOMER },
      order: { createdAt: 'DESC' },
    });

    // Remove sensitive data from response
    const customersResponse = customers.map((customer) => {
      const { password, emailVerificationToken, ...customerResponse } =
        customer;
      return customerResponse;
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Customers retrieved successfully',
      payload: customersResponse,
    };
  }

  async findAllPaginated(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<StructuredResponse> {
    const [customers, total] = await this.identityRepository.findAndCount({
      where: { type: ACCOUNT_TYPE.CUSTOMER },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    // Remove sensitive data from response
    const customersResponse = customers.map((customer) => {
      const { password, emailVerificationToken, ...customerResponse } =
        customer;
      return customerResponse;
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Customers retrieved successfully',
      payload: customersResponse,
      total,
      totalPages,
    };
  }

  async findOne(id: string): Promise<StructuredResponse> {
    const customer = await this.identityRepository.findOne({
      where: { id, type: ACCOUNT_TYPE.CUSTOMER },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Remove sensitive data from response
    const { password, emailVerificationToken, ...customerResponse } = customer;

    return {
      status: true,
      statusCode: 200,
      message: 'Customer retrieved successfully',
      payload: customerResponse,
    };
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<StructuredResponse> {
    const customer = await this.identityRepository.findOne({
      where: { id, type: ACCOUNT_TYPE.CUSTOMER },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Check if email is being updated and if it conflicts with existing emails
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.identityRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingCustomer) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    Object.assign(customer, updateCustomerDto);
    const updatedCustomer = await this.identityRepository.save(customer);

    // Remove sensitive data from response
    const { password, emailVerificationToken, ...customerResponse } =
      updatedCustomer;

    return {
      status: true,
      statusCode: 200,
      message: 'Customer updated successfully',
      payload: customerResponse,
    };
  }

  async remove(id: string): Promise<StructuredResponse> {
    const customer = await this.identityRepository.findOne({
      where: { id, type: ACCOUNT_TYPE.CUSTOMER },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    await this.identityRepository.remove(customer);

    return {
      status: true,
      statusCode: 200,
      message: 'Customer deleted successfully',
      payload: null,
    };
  }

  async findByEmail(email: string): Promise<IdentityEntity | null> {
    return await this.identityRepository.findOne({
      where: { email, type: ACCOUNT_TYPE.CUSTOMER },
    });
  }

  private generatePassword(): string {
    // Generate a random password with letters, numbers, and special characters
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    // Ensure at least one character from each category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special character

    // Fill the rest randomly
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
