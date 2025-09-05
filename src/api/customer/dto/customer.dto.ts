import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength, IsEmail, IsOptional } from 'class-validator';

export class CreateCustomerDto {
    @ApiProperty({
        description: 'First name of the customer',
        example: 'Jane',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    firstName: string;

    @ApiProperty({
        description: 'Last name of the customer',
        example: 'Smith',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    lastName: string;

    @ApiPropertyOptional({
        description: 'Other name of the customer',
        example: 'Elizabeth',
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    otherName?: string;

    @ApiProperty({
        description: 'Email address of the customer',
        example: 'jane.smith@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Phone number of the customer',
        example: '+1234567890',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(20)
    phoneNumber: string;
}

export class UpdateCustomerDto {
    @ApiPropertyOptional({
        description: 'First name of the customer',
        example: 'Jane',
    })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    firstName?: string;

    @ApiPropertyOptional({
        description: 'Last name of the customer',
        example: 'Smith',
    })
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    lastName?: string;

    @ApiPropertyOptional({
        description: 'Other name of the customer',
        example: 'Elizabeth',
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    otherName?: string;

    @ApiPropertyOptional({
        description: 'Email address of the customer',
        example: 'jane.smith@example.com',
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        description: 'Phone number of the customer',
        example: '+1234567890',
    })
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(20)
    phoneNumber?: string;
}
