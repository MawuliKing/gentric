import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseDbEntity } from './base.entity';
import { ProjectTypesEntity } from './project-types.entity';
import { FormSection } from '../../utils/interfaces/form-builder.interface';

@Entity('report_templates')
export class ReportTemplatesEntity extends BaseDbEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  numberOfSubmissions?: number;

  @Column({ type: 'jsonb', nullable: true })
  sections: FormSection[];

  @ManyToOne(() => ProjectTypesEntity, (projectType) => projectType.id)
  projectType: ProjectTypesEntity;
}
