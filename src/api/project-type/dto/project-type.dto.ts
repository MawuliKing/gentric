import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectTypeDto {
    @ApiProperty({
        description: 'Name of the project type',
        example: 'Web Development',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiPropertyOptional({
        description: 'Description of the project type',
        example: 'Projects involving web application development',
        maxLength: 500,
    })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;
}

export class UpdateProjectTypeDto {
    @ApiPropertyOptional({
        description: 'Name of the project type',
        example: 'Web Development',
        maxLength: 255,
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @ApiPropertyOptional({
        description: 'Description of the project type',
        example: 'Projects involving web application development',
        maxLength: 500,
    })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;
}
