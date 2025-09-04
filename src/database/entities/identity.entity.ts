import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'src/utils/generics/enums';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany
} from 'typeorm';
import { BaseDbEntity } from './base.entity';
import { NotificationEntity } from './notification.entity';

@Entity({ name: 'identities' })
export class IdentityEntity extends BaseDbEntity {
  @Column({ length: 225, nullable: true })
  firstName: string;

  @Column({ length: 225, nullable: true })
  lastName: string;

  @Column({ length: 225, type: 'varchar', nullable: true })
  otherName: string;

  @Column({ length: 100, type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ length: 100, type: 'varchar', unique: false, nullable: true })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  fullName: string;

  @Column({
    type: 'enum',
    enum: ACCOUNT_STATUS,
    default: ACCOUNT_STATUS.ACTIVE,
  })
  status: ACCOUNT_STATUS;

  @Column({
    type: 'enum',
    enum: ACCOUNT_TYPE,
    default: ACCOUNT_TYPE.CUSTOMER,
  })
  type: ACCOUNT_TYPE;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  passwordResetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'text', nullable: true })
  emailVerificationToken: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  setFullName() {
    this.fullName = [this.firstName, this.otherName, this.lastName]
      .filter(Boolean)
      .join(' ');
  }

  // Relations
  @OneToMany(() => NotificationEntity, (notification) => notification.identity)
  notifications: NotificationEntity[];
}
