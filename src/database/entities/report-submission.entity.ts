import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseDbEntity } from './base.entity';
import { ProjectsEntity } from './project.entity';
import { ReportTemplatesEntity } from './report-templates.entity';
import { REPORT_STATUS } from 'src/utils/generics/enums';

@Entity('report_submissions')
export class ReportSubmissionEntity extends BaseDbEntity {
  @Column({ type: 'jsonb', nullable: true })
  reportData: any;

  @Column({ type: 'enum', enum: REPORT_STATUS, default: REPORT_STATUS.DRAFT })
  status: REPORT_STATUS;

  @ManyToOne(() => ProjectsEntity, (project) => project.id, { nullable: false })
  project: ProjectsEntity;

  @ManyToOne(
    () => ReportTemplatesEntity,
    (reportTemplate) => reportTemplate.id,
    { nullable: false },
  )
  reportTemplate: ReportTemplatesEntity;
}
