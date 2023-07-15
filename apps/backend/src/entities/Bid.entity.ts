import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './_BaseEntity';
import { User } from './User.entity';
import { BidItem } from './BidItem.entity';

@Entity()
export class Bid extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: 'FK_USER_BID' })
  user: User;

  @ManyToOne(() => BidItem, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'bidItemId',
    foreignKeyConstraintName: 'FK_BID_ITEM_USER',
  })
  bidItem: BidItem;

  @Column({ type: 'int', default: 1 })
  price: number;
}
