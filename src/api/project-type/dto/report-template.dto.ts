import { IsString, IsOptional, IsNotEmpty, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormSection } from '../../../utils/interfaces/form-builder.interface';

export class CreateReportTemplateDto {
    @ApiProperty({
        description: 'Name of the report template',
        example: 'Project Requirements Form',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        description: 'Description of the report template',
        example: 'Template for gathering project requirements',
        maxLength: 1000,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'ID of the project type this template belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    @IsNotEmpty()
    projectTypeId: string;

    @ApiProperty({
        description: 'Form sections containing fields',
        type: 'array',
        items: { type: 'object' },
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    sections: FormSection[];
}

export class UpdateReportTemplateDto {
    @ApiPropertyOptional({
        description: 'Name of the report template',
        example: 'Project Requirements Form',
        maxLength: 255,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'Description of the report template',
        example: 'Template for gathering project requirements',
        maxLength: 1000,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'ID of the project type this template belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    @IsOptional()
    projectTypeId?: string;

    @ApiPropertyOptional({
        description: 'Form sections containing fields',
        type: 'array',
        items: { type: 'object' },
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    @IsOptional()
    sections?: FormSection[];
}
