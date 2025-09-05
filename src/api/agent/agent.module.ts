import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentController } from './controllers/agent.controller';
import { AgentService } from './services/agent.service';
import { IdentityEntity } from '../../database/entities/identity.entity';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([IdentityEntity]),
        EmailModule,
    ],
    controllers: [AgentController],
    providers: [AgentService],
    exports: [AgentService],
})
export class AgentModule { }
