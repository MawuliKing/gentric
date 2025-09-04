import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseDbEntity } from './base.entity';
import { IdentityEntity } from './identity.entity';

@Entity('notifications')
export class NotificationEntity extends BaseDbEntity {
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'jsonb', nullable: false })
  data: Record<string, string>;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;
  
  @ManyToOne(() => IdentityEntity, (identity) => identity.id)
  identity: IdentityEntity;
}
