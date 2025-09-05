import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsEntity } from '../../database/entities/project.entity';
import { IdentityEntity } from '../../database/entities/identity.entity';
import { ProjectTypesEntity } from '../../database/entities/project-types.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { StructuredResponse } from '../../utils/dto/structured-response.dto';
import { ACCOUNT_TYPE } from '../../utils/generics/enums';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
    @InjectRepository(IdentityEntity)
    private readonly identityRepository: Repository<IdentityEntity>,
    @InjectRepository(ProjectTypesEntity)
    private readonly projectTypesRepository: Repository<ProjectTypesEntity>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<StructuredResponse> {
    let assignedAgent: IdentityEntity | undefined = undefined;
    let customer: IdentityEntity | undefined = undefined;

    // Verify assigned agent exists if provided
    if (createProjectDto.assignedAgentId) {
      const foundAgent = await this.identityRepository.findOne({
        where: { id: createProjectDto.assignedAgentId },
      });

      if (!foundAgent) {
        throw new NotFoundException(
          `Assigned agent with ID ${createProjectDto.assignedAgentId} not found`,
        );
      }

      assignedAgent = foundAgent;
    }

    // Verify customer exists and is a customer if provided
    if (createProjectDto.customerId) {
      const foundCustomer = await this.identityRepository.findOne({
        where: { id: createProjectDto.customerId, type: ACCOUNT_TYPE.CUSTOMER },
      });

      if (!foundCustomer) {
        throw new NotFoundException(
          `Customer with ID ${createProjectDto.customerId} not found`,
        );
      }

      customer = foundCustomer;
    }

    // Verify project type exists
    const projectType = await this.projectTypesRepository.findOne({
      where: { id: createProjectDto.projectTypeId },
    });

    if (!projectType) {
      throw new NotFoundException(
        `Project type with ID ${createProjectDto.projectTypeId} not found`,
      );
    }

    // Check if project with same name already exists
    const existingProject = await this.projectsRepository.findOne({
      where: { name: createProjectDto.name },
    });

    if (existingProject) {
      throw new ConflictException('Project with this name already exists');
    }

    const project = this.projectsRepository.create({
      name: createProjectDto.name,
      description: createProjectDto.description,
      assignedAgent,
      customer,
      projectType,
    });

    const savedProject = await this.projectsRepository.save(project);

    return {
      status: true,
      statusCode: 201,
      message: 'Project created successfully',
      payload: savedProject,
    };
  }

  async findAll(): Promise<ProjectsEntity[]> {
    return await this.projectsRepository.find({
      relations: ['assignedAgent', 'customer', 'projectType'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPaginated(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<StructuredResponse> {
    const [data, total] = await this.projectsRepository.findAndCount({
      relations: ['assignedAgent', 'customer', 'projectType'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      status: true,
      statusCode: 200,
      message: 'Projects retrieved successfully',
      payload: data,
      total,
      totalPages,
    };
  }

  async findByAssignedAgent(
    assignedAgentId: string,
  ): Promise<ProjectsEntity[]> {
    return await this.projectsRepository.find({
      where: { assignedAgent: { id: assignedAgentId } },
      relations: ['assignedAgent', 'customer', 'projectType'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAssignedAgentPaginated(
    assignedAgentId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<StructuredResponse> {
    const [data, total] = await this.projectsRepository.findAndCount({
      where: { assignedAgent: { id: assignedAgentId } },
      relations: ['assignedAgent', 'customer', 'projectType'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      status: true,
      statusCode: 200,
      message: 'Projects retrieved successfully',
      payload: data,
      total,
      totalPages,
    };
  }

  async findByCustomer(customerId: string): Promise<ProjectsEntity[]> {
    return await this.projectsRepository.find({
      where: { customer: { id: customerId } },
      relations: ['assignedAgent', 'customer', 'projectType'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomerPaginated(
    customerId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<StructuredResponse> {
    const [data, total] = await this.projectsRepository.findAndCount({
      where: { customer: { id: customerId } },
      relations: ['assignedAgent', 'customer', 'projectType'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      status: true,
      statusCode: 200,
      message: 'Projects retrieved successfully',
      payload: data,
      total,
      totalPages,
    };
  }

  async findByProjectType(projectTypeId: string): Promise<ProjectsEntity[]> {
    return await this.projectsRepository.find({
      where: { projectType: { id: projectTypeId } },
      relations: ['assignedAgent', 'customer', 'projectType'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProjectTypePaginated(
    projectTypeId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<StructuredResponse> {
    const [data, total] = await this.projectsRepository.findAndCount({
      where: { projectType: { id: projectTypeId } },
      relations: ['assignedAgent', 'customer', 'projectType'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      status: true,
      statusCode: 200,
      message: 'Projects retrieved successfully',
      payload: data,
      total,
      totalPages,
    };
  }

  async findOne(id: string): Promise<StructuredResponse> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: [
        'assignedAgent',
        'customer',
        'projectType',
        'projectType.reports',
      ],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Project retrieved successfully',
      payload: project,
    };
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<StructuredResponse> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['assignedAgent', 'customer', 'projectType'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    let assignedAgent: IdentityEntity | null | undefined = undefined;
    let customer: IdentityEntity | null | undefined = undefined;
    let projectType: ProjectTypesEntity | undefined = undefined;

    // If assigned agent is being updated, verify it exists
    if (updateProjectDto.assignedAgentId !== undefined) {
      if (updateProjectDto.assignedAgentId) {
        const foundAgent = await this.identityRepository.findOne({
          where: { id: updateProjectDto.assignedAgentId },
        });

        if (!foundAgent) {
          throw new NotFoundException(
            `Assigned agent with ID ${updateProjectDto.assignedAgentId} not found`,
          );
        }
        assignedAgent = foundAgent;
      } else {
        // If assignedAgentId is explicitly set to null/undefined, set assignedAgent to null
        assignedAgent = null;
      }
    }

    // If customer is being updated, verify it exists and is a customer
    if (updateProjectDto.customerId !== undefined) {
      if (updateProjectDto.customerId) {
        const foundCustomer = await this.identityRepository.findOne({
          where: {
            id: updateProjectDto.customerId,
            type: ACCOUNT_TYPE.CUSTOMER,
          },
        });

        if (!foundCustomer) {
          throw new NotFoundException(
            `Customer with ID ${updateProjectDto.customerId} not found`,
          );
        }
        customer = foundCustomer;
      } else {
        // If customerId is explicitly set to null/undefined, set customer to null
        customer = null;
      }
    }

    // If project type is being updated, verify it exists
    if (updateProjectDto.projectTypeId) {
      const foundProjectType = await this.projectTypesRepository.findOne({
        where: { id: updateProjectDto.projectTypeId },
      });

      if (!foundProjectType) {
        throw new NotFoundException(
          `Project type with ID ${updateProjectDto.projectTypeId} not found`,
        );
      }
      projectType = foundProjectType;
    }

    // Check if name is being updated and if it conflicts with existing names
    if (updateProjectDto.name && updateProjectDto.name !== project.name) {
      const existingProject = await this.projectsRepository.findOne({
        where: { name: updateProjectDto.name },
      });

      if (existingProject) {
        throw new ConflictException('Project with this name already exists');
      }
    }

    // Update the project with the new values
    Object.assign(project, updateProjectDto);

    // Assign the entity objects if they were updated
    if (assignedAgent !== undefined) {
      (project as any).assignedAgent = assignedAgent;
    }
    if (customer !== undefined) {
      (project as any).customer = customer;
    }
    if (projectType) {
      project.projectType = projectType;
    }

    const updatedProject = await this.projectsRepository.save(project);

    return {
      status: true,
      statusCode: 200,
      message: 'Project updated successfully',
      payload: updatedProject,
    };
  }

  async remove(id: string): Promise<StructuredResponse> {
    const project = await this.projectsRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.projectsRepository.remove(project);

    return {
      status: true,
      statusCode: 200,
      message: 'Project deleted successfully',
      payload: null,
    };
  }

  async findByName(name: string): Promise<ProjectsEntity | null> {
    return await this.projectsRepository.findOne({
      where: { name },
      relations: ['assignedAgent', 'customer', 'projectType'],
    });
  }
}
