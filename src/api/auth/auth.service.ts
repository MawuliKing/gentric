import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { IdentityEntity } from 'src/database/entities/identity.entity';
import { EmailService } from 'src/api/email/email.service';
import {
    RegisterDto,
    LoginDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    ChangePasswordDto,
    UpdateProfileDto,
    AuthResponseDto,
    MessageResponseDto,
    UserDto
} from './auth.dto';
import { ACCOUNT_TYPE } from 'src/utils/generics/enums';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(IdentityEntity)
        private identityRepository: Repository<IdentityEntity>,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { email, password, ...userData } = registerDto;

        // Check if user already exists
        const existingUser = await this.identityRepository.findOne({
            where: { email }
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = this.identityRepository.create({
            ...userData,
            email,
            password: hashedPassword,
            emailVerificationToken,
            type: userData.type || ACCOUNT_TYPE.CUSTOMER,
        });

        const savedUser = await this.identityRepository.save(user);

        // Generate JWT token
        const payload = {
            sub: savedUser.id,
            email: savedUser.email,
            type: savedUser.type,
            isAdmin: savedUser.type === ACCOUNT_TYPE.ADMIN,
        };

        const accessToken = this.jwtService.sign(payload);

        // Send verification email
        try {
            await this.emailService.sendVerificationEmail(
                savedUser.email,
                savedUser.firstName,
                emailVerificationToken
            );
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Don't throw error here, user is still created successfully
        }

        const userDto: UserDto = {
            id: savedUser.id,
            email: savedUser.email,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            otherName: savedUser.otherName,
            phoneNumber: savedUser.phoneNumber,
            type: savedUser.type,
            isEmailVerified: savedUser.isEmailVerified,
            lastLoginAt: savedUser.lastLoginAt,
        };

        return {
            status: true,
            statusCode: 201,
            message: 'User registered successfully',
            payload: {
                accessToken,
                user: userDto,
            },
            total: 0,
            totalPages: 0,
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        // Find user by email
        const user = await this.identityRepository.findOne({
            where: { email }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Check if account is active
        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedException('Account is not active');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Update last login
        user.lastLoginAt = new Date();
        await this.identityRepository.save(user);

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
            type: user.type,
            isAdmin: user.type === ACCOUNT_TYPE.ADMIN,
        };

        const accessToken = this.jwtService.sign(payload);

        const userDto: UserDto = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            otherName: user.otherName,
            phoneNumber: user.phoneNumber,
            type: user.type,
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
        };

        return {
            status: true,
            statusCode: 200,
            message: 'Login successful',
            payload: {
                accessToken,
                user: userDto,
            },
            total: 0,
            totalPages: 0,
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<MessageResponseDto> {
        const { email } = forgotPasswordDto;

        const user = await this.identityRepository.findOne({
            where: { email }
        });

        if (!user) {
            // Don't reveal if email exists or not for security
            return {
                status: true,
                statusCode: 200,
                message: 'If the email exists, a password reset link has been sent',
                payload: null,
                total: 0,
                totalPages: 0,
            };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        // Save reset token
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await this.identityRepository.save(user);

        // Send reset email
        try {
            await this.emailService.sendPasswordResetEmail(
                user.email,
                user.firstName,
                resetToken
            );
        } catch (error) {
            console.error('Failed to send password reset email:', error);
            throw new BadRequestException('Failed to send password reset email');
        }

        return {
            status: true,
            statusCode: 200,
            message: 'If the email exists, a password reset link has been sent',
            payload: null,
            total: 0,
            totalPages: 0,
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<MessageResponseDto> {
        const { token, newPassword } = resetPasswordDto;

        const user = await this.identityRepository.findOne({
            where: {
                passwordResetToken: token,
            }
        });

        if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        // Hash new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await this.identityRepository.save(user);

        return {
            status: true,
            statusCode: 200,
            message: 'Password reset successfully',
            payload: null,
            total: 0,
            totalPages: 0,
        };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<MessageResponseDto> {
        const { currentPassword, newPassword } = changePasswordDto;

        const user = await this.identityRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hash new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        user.password = hashedPassword;
        await this.identityRepository.save(user);

        return {
            status: true,
            statusCode: 200,
            message: 'Password changed successfully',
            payload: null,
            total: 0,
            totalPages: 0,
        };
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<AuthResponseDto> {
        const user = await this.identityRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Update user fields
        Object.assign(user, updateProfileDto);
        const updatedUser = await this.identityRepository.save(user);

        // Generate new JWT token with updated info
        const payload = {
            sub: updatedUser.id,
            email: updatedUser.email,
            type: updatedUser.type,
            isAdmin: updatedUser.type === ACCOUNT_TYPE.ADMIN,
        };

        const accessToken = this.jwtService.sign(payload);

        const userDto: UserDto = {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            otherName: updatedUser.otherName,
            phoneNumber: updatedUser.phoneNumber,
            type: updatedUser.type,
            isEmailVerified: updatedUser.isEmailVerified,
            lastLoginAt: updatedUser.lastLoginAt,
        };

        return {
            status: true,
            statusCode: 200,
            message: 'Profile updated successfully',
            payload: {
                accessToken,
                user: userDto,
            },
            total: 0,
            totalPages: 0,
        };
    }

    async getProfile(userId: string): Promise<AuthResponseDto> {
        const user = await this.identityRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userDto: UserDto = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            otherName: user.otherName,
            phoneNumber: user.phoneNumber,
            type: user.type,
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
        };

        return {
            status: true,
            statusCode: 200,
            message: 'Profile retrieved successfully',
            payload: {
                accessToken: '', // Not needed for profile retrieval
                user: userDto,
            },
            total: 0,
            totalPages: 0,
        };
    }

    async verifyEmail(token: string): Promise<MessageResponseDto> {
        const user = await this.identityRepository.findOne({
            where: { emailVerificationToken: token }
        });

        if (!user) {
            throw new BadRequestException('Invalid verification token');
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        await this.identityRepository.save(user);

        return {
            status: true,
            statusCode: 200,
            message: 'Email verified successfully',
            payload: null,
            total: 0,
            totalPages: 0,
        };
    }

    async resendVerificationEmail(email: string): Promise<MessageResponseDto> {
        const user = await this.identityRepository.findOne({
            where: { email }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.isEmailVerified) {
            throw new BadRequestException('Email is already verified');
        }

        // Generate new verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = emailVerificationToken;
        await this.identityRepository.save(user);

        try {
            await this.emailService.sendVerificationEmail(
                user.email,
                user.firstName,
                emailVerificationToken
            );
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw new BadRequestException('Failed to send verification email');
        }

        return {
            status: true,
            statusCode: 200,
            message: 'Verification email sent successfully',
            payload: null,
            total: 0,
            totalPages: 0,
        };
    }
}