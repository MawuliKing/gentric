import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength, IsEmail, IsOptional } from 'class-validator';

export class CreateAgentDto {
    @ApiProperty({
        description: 'First name of the agent',
        example: 'John',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    firstName: string;

    @ApiProperty({
        description: 'Last name of the agent',
        example: 'Doe',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    lastName: string;

    @ApiPropertyOptional({
        description: 'Other name of the agent',
        example: 'Michael',
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    otherName?: string;

    @ApiProperty({
        description: 'Email address of the agent',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Phone number of the agent',
        example: '+1234567890',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(20)
    phoneNumber: string;
}

export class UpdateAgentDto {
    @ApiPropertyOptional({
        description: 'First name of the agent',
        example: 'John',
    })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    firstName?: string;

    @ApiPropertyOptional({
        description: 'Last name of the agent',
        example: 'Doe',
    })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    lastName?: string;

    @ApiPropertyOptional({
        description: 'Other name of the agent',
        example: 'Michael',
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    otherName?: string;

    @ApiPropertyOptional({
        description: 'Email address of the agent',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        description: 'Phone number of the agent',
        example: '+1234567890',
    })
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(20)
    phoneNumber?: string;
}
