import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseDbEntity } from "./base.entity";
import { ReportTemplatesEntity } from "./report-templates.entity";

@Entity('project_types')
export class ProjectTypesEntity extends BaseDbEntity {
    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @OneToMany(() => ReportTemplatesEntity, (report) => report.projectType)
    reports: ReportTemplatesEntity[];
}