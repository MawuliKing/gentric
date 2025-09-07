import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseDbEntity } from './base.entity';
import { ProjectsEntity } from './project.entity';
import { ReportTemplatesEntity } from './report-templates.entity';
import { REPORT_STATUS } from 'src/utils/generics/enums';
import { ReportSectionDto } from 'src/api/reports/dto/report-submission.dto';

@Entity('report_submissions')
export class ReportSubmissionEntity extends BaseDbEntity {
  @Column({ type: 'jsonb', nullable: true })
  reportData: ReportSectionDto[];

  @Column({ type: 'enum', enum: REPORT_STATUS, default: REPORT_STATUS.SUBMITTED })
  status: REPORT_STATUS;

  @ManyToOne(() => ProjectsEntity, (project) => project.id, { nullable: false })
  project: ProjectsEntity;

  @Column({ type: 'text', nullable: true })
  approvalComments: string;

  @Column({ type: 'text', nullable: true })
  rejectionComments: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @ManyToOne(
    () => ReportTemplatesEntity,
    (reportTemplate) => reportTemplate.id,
    { nullable: false },
  )
  reportTemplate: ReportTemplatesEntity;
}
