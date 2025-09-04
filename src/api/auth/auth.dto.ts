import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ACCOUNT_TYPE } from 'src/utils/generics/enums';
import { StructuredResponse } from 'src/utils/dto/structured-response.dto';

export class RegisterDto {
    @ApiProperty({ example: 'John', description: 'User first name' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'User last name' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiPropertyOptional({ example: 'Michael', description: 'User other name' })
    @IsString()
    @IsOptional()
    otherName?: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ example: 'Password@123', description: 'User password (min 8 characters)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
    password: string;

    @ApiPropertyOptional({
        example: ACCOUNT_TYPE.CUSTOMER,
        description: 'Account type',
        enum: ACCOUNT_TYPE
    })
    @IsEnum(ACCOUNT_TYPE)
    @IsOptional()
    type?: ACCOUNT_TYPE;
}

export class LoginDto {
    @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Password@123', description: 'User password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'reset-token-here', description: 'Password reset token' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'newPassword@123', description: 'New password (min 8 characters)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
    newPassword: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: 'oldPassword@123', description: 'Current password' })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({ example: 'newPassword@123', description: 'New password (min 8 characters)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
    newPassword: string;
}

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'John', description: 'User first name' })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiPropertyOptional({ example: 'Michael', description: 'User other name' })
    @IsString()
    @IsOptional()
    otherName?: string;

    @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
    @IsString()
    @IsOptional()
    phoneNumber?: string;
}

export class UserDto {
    @ApiProperty({ example: 'uuid-here', description: 'User ID' })
    id: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
    email: string;

    @ApiProperty({ example: 'John', description: 'User first name' })
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'User last name' })
    lastName: string;

    @ApiPropertyOptional({ example: 'Michael', description: 'User other name' })
    otherName?: string;

    @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
    phoneNumber?: string;

    @ApiProperty({ example: 'CUSTOMER', description: 'Account type', enum: ACCOUNT_TYPE })
    type: ACCOUNT_TYPE;

    @ApiPropertyOptional({ example: true, description: 'Email verification status' })
    isEmailVerified?: boolean;

    @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', description: 'Last login date' })
    lastLoginAt?: Date;
}

export class AuthResponseDto extends StructuredResponse {
    @ApiProperty({
        example: {
            status: true,
            statusCode: 201,
            message: 'User registered successfully',
            payload: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'uuid-here',
                    email: 'john.doe@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    type: 'CUSTOMER'
                }
            },
            total: 0,
            totalPages: 0
        },
        description: 'Authentication response with user data and access token'
    })
    declare payload: {
        accessToken: string;
        user: UserDto;
    };
}

export class MessageResponseDto extends StructuredResponse {
    @ApiProperty({
        example: {
            status: true,
            statusCode: 200,
            message: 'Password reset email sent successfully',
            payload: null,
            total: 0,
            totalPages: 0
        },
        description: 'Simple message response'
    })
    declare payload: null;
}
