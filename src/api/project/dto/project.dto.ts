import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'E-commerce Platform Redesign',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Description of the project',
    example:
      'Complete redesign of our existing e-commerce platform to improve user experience',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiPropertyOptional({
    description: 'ID of the assigned agent',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  assignedAgentId?: string;

  @ApiPropertyOptional({
    description: 'ID of the customer',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'ID of the project type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  projectTypeId: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({
    description: 'Name of the project',
    example: 'E-commerce Platform Redesign',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the project',
    example:
      'Complete redesign of our existing e-commerce platform to improve user experience',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the assigned agent',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  assignedAgentId?: string;

  @ApiPropertyOptional({
    description: 'ID of the customer',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'ID of the project type',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  projectTypeId?: string;
}
