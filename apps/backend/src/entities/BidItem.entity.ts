import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './_BaseEntity';
import { User } from './User.entity';

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

  @Column({
    type: 'enum',
    enum: ['ongoing', 'private', 'completed'],
    default: 'private',
  })
  state: BidItemStateEnum;

  @Column({ type: 'int', default: 1 })
  timeWindow: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'winnerId',
    foreignKeyConstraintName: 'FK_WINNER',
  })
  winner: User;

  @ManyToOne(() => User, (user) => user.bidItems)
  @JoinColumn({
    name: 'createdById',
    foreignKeyConstraintName: 'FK_CREATED_USER',
  })
  createdBy: User;
}
