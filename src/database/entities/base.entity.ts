import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseDbEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn({
    select: false,
  })
  deletedAt!: Date;
}
