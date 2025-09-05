import { Column, Entity, ManyToOne } from "typeorm";
import { BaseDbEntity } from "./base.entity";
import { ProjectTypesEntity } from "./project-types.entity";
import { IdentityEntity } from "./identity.entity";

@Entity('projects')
export class ProjectsEntity extends BaseDbEntity {
    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @ManyToOne(() => IdentityEntity, (identity) => identity.id)
    assignedAgent: IdentityEntity;

    @ManyToOne(() => IdentityEntity, (identity) => identity.id)
    customer: IdentityEntity;

    @ManyToOne(() => ProjectTypesEntity, (projectType) => projectType.id)
    projectType: ProjectTypesEntity;
}