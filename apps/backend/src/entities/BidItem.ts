import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './_BaseEntity';
import { User } from './User';

export enum BidItemStateEnum {
  ONGOING = 'ongoing',
  PRIVATE = 'private',
  COMPLETED = 'completed',
}

@Entity()
export class BidItem extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  body: string;

  @Column({ type: 'enum', enum: ['ongoing', 'private', 'completed'] })
  state: BidItemStateEnum;

  @Column({ type: 'int', default: 1 })
  timeWindow: number;

  @ManyToOne(() => User, (user) => user.bidItems)
  createdBy: User;
}
