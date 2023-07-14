import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './_BaseEntity';
import { BidItem } from './BidItem';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  userName: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @OneToMany(() => BidItem, (bidItem) => bidItem.createdBy)
  bidItems: BidItem[];
}
