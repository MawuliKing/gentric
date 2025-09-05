import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentityEntity } from '../../../database/entities/identity.entity';
import { CreateAgentDto, UpdateAgentDto } from '../dto/agent.dto';
import { StructuredResponse } from '../../../utils/dto/structured-response.dto';
import { EmailService } from '../../email/email.service';
import { ACCOUNT_TYPE, ACCOUNT_STATUS } from '../../../utils/generics/enums';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AgentService {
    constructor(
        @InjectRepository(IdentityEntity)
        private readonly identityRepository: Repository<IdentityEntity>,
        private readonly emailService: EmailService,
    ) { }

    async create(createAgentDto: CreateAgentDto): Promise<StructuredResponse> {
        // Check if agent with same email already exists
        const existingAgent = await this.identityRepository.findOne({
            where: { email: createAgentDto.email }
        });

        if (existingAgent) {
            throw new ConflictException('Agent with this email already exists');
        }

        // Generate a random password
        const generatedPassword = this.generatePassword();

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        // Create agent
        const agent = this.identityRepository.create({
            ...createAgentDto,
            password: hashedPassword,
            emailVerificationToken,
            type: ACCOUNT_TYPE.AGENT,
            status: ACCOUNT_STATUS.ACTIVE,
            isEmailVerified: false,
        });

        const savedAgent = await this.identityRepository.save(agent);

        // Send password email
        try {
            await this.emailService.sendPasswordEmail(
                savedAgent.email,
                savedAgent.firstName,
                generatedPassword,
                'agent'
            );
        } catch (error) {
            console.error('Failed to send password email:', error);
            // Don't throw error here, agent is still created successfully
        }

        // Remove sensitive data from response
        const { password, emailVerificationToken: _, ...agentResponse } = savedAgent;

        return {
            status: true,
            statusCode: 201,
            message: 'Agent created successfully. Password sent to email.',
            payload: agentResponse
        };
    }

    async findAll(): Promise<StructuredResponse> {
        const agents = await this.identityRepository.find({
            where: { type: ACCOUNT_TYPE.AGENT },
            order: { createdAt: 'DESC' },
        });

        // Remove sensitive data from response
        const agentsResponse = agents.map(agent => {
            const { password, emailVerificationToken, ...agentResponse } = agent;
            return agentResponse;
        });

        return {
            status: true,
            statusCode: 200,
            message: 'Agents retrieved successfully',
            payload: agentsResponse
        };
    }

    async findAllPaginated(page: number = 1, pageSize: number = 10): Promise<StructuredResponse> {
        const [agents, total] = await this.identityRepository.findAndCount({
            where: { type: ACCOUNT_TYPE.AGENT },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const totalPages = Math.ceil(total / pageSize);

        // Remove sensitive data from response
        const agentsResponse = agents.map(agent => {
            const { password, emailVerificationToken, ...agentResponse } = agent;
            return agentResponse;
        });

        return {
            status: true,
            statusCode: 200,
            message: 'Agents retrieved successfully',
            payload: agentsResponse,
            total,
            totalPages
        };
    }

    async findOne(id: string): Promise<StructuredResponse> {
        const agent = await this.identityRepository.findOne({
            where: { id, type: ACCOUNT_TYPE.AGENT },
        });

        if (!agent) {
            throw new NotFoundException(`Agent with ID ${id} not found`);
        }

        // Remove sensitive data from response
        const { password, emailVerificationToken, ...agentResponse } = agent;

        return {
            status: true,
            statusCode: 200,
            message: 'Agent retrieved successfully',
            payload: agentResponse
        };
    }

    async update(id: string, updateAgentDto: UpdateAgentDto): Promise<StructuredResponse> {
        const agent = await this.identityRepository.findOne({
            where: { id, type: ACCOUNT_TYPE.AGENT },
        });

        if (!agent) {
            throw new NotFoundException(`Agent with ID ${id} not found`);
        }

        // Check if email is being updated and if it conflicts with existing emails
        if (updateAgentDto.email && updateAgentDto.email !== agent.email) {
            const existingAgent = await this.identityRepository.findOne({
                where: { email: updateAgentDto.email },
            });

            if (existingAgent) {
                throw new ConflictException('Agent with this email already exists');
            }
        }

        Object.assign(agent, updateAgentDto);
        const updatedAgent = await this.identityRepository.save(agent);

        // Remove sensitive data from response
        const { password, emailVerificationToken, ...agentResponse } = updatedAgent;

        return {
            status: true,
            statusCode: 200,
            message: 'Agent updated successfully',
            payload: agentResponse
        };
    }

    async remove(id: string): Promise<StructuredResponse> {
        const agent = await this.identityRepository.findOne({
            where: { id, type: ACCOUNT_TYPE.AGENT },
        });

        if (!agent) {
            throw new NotFoundException(`Agent with ID ${id} not found`);
        }

        await this.identityRepository.remove(agent);

        return {
            status: true,
            statusCode: 200,
            message: 'Agent deleted successfully',
            payload: null
        };
    }

    async findByEmail(email: string): Promise<IdentityEntity | null> {
        return await this.identityRepository.findOne({
            where: { email, type: ACCOUNT_TYPE.AGENT },
        });
    }

    private generatePassword(): string {
        // Generate a random password with letters, numbers, and special characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
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
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }
}
