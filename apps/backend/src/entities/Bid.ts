import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './_BaseEntity';
import { User } from './User';
import { BidItem } from './BidItem';

@Entity()
export class Bid extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => BidItem)
  bidItem: BidItem;

  @Column({ type: 'int', default: 1 })
  price: number;
}
