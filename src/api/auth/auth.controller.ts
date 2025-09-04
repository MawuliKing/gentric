import {
    Controller,
    Post,
    Get,
    Put,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/utils/guards/auth.giuard';
import { Public } from 'src/utils/decorators/public.decorator';
import {
    RegisterDto,
    LoginDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    ChangePasswordDto,
    UpdateProfileDto,
    AuthResponseDto,
    MessageResponseDto
} from './auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: AuthResponseDto
    })
    @ApiResponse({ status: 409, description: 'User with this email already exists' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: AuthResponseDto
    })
    @ApiResponse({ status: 401, description: 'Invalid email or password' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    @Public()
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({
        status: 200,
        description: 'Password reset email sent if email exists',
        type: MessageResponseDto
    })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<MessageResponseDto> {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Public()
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiResponse({
        status: 200,
        description: 'Password reset successfully',
        type: MessageResponseDto
    })
    @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<MessageResponseDto> {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @UseGuards(AuthGuard)
    @Put('change-password')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change password (authenticated user)' })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
        type: MessageResponseDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized or incorrect current password' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async changePassword(
        @Request() req: any,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<MessageResponseDto> {
        return this.authService.changePassword(req.user.sub, changePasswordDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({
        status: 200,
        description: 'Profile retrieved successfully',
        type: AuthResponseDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getProfile(@Request() req: any): Promise<AuthResponseDto> {
        return this.authService.getProfile(req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Put('profile')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({
        status: 200,
        description: 'Profile updated successfully',
        type: AuthResponseDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async updateProfile(
        @Request() req: any,
        @Body() updateProfileDto: UpdateProfileDto
    ): Promise<AuthResponseDto> {
        return this.authService.updateProfile(req.user.sub, updateProfileDto);
    }

    @Public()
    @Get('verify-email')
    @ApiOperation({ summary: 'Verify email address' })
    @ApiQuery({ name: 'token', description: 'Email verification token' })
    @ApiResponse({
        status: 200,
        description: 'Email verified successfully',
        type: MessageResponseDto
    })
    @ApiResponse({ status: 400, description: 'Invalid verification token' })
    async verifyEmail(@Query('token') token: string): Promise<MessageResponseDto> {
        return this.authService.verifyEmail(token);
    }

    @Public()
    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Resend email verification' })
    @ApiResponse({
        status: 200,
        description: 'Verification email sent successfully',
        type: MessageResponseDto
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 400, description: 'Email already verified or failed to send' })
    async resendVerificationEmail(@Body('email') email: string): Promise<MessageResponseDto> {
        return this.authService.resendVerificationEmail(email);
    }
}