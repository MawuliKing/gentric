import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IdentityEntity } from 'src/database/entities/identity.entity';
import { EmailModule } from 'src/api/email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([IdentityEntity]),
        EmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
