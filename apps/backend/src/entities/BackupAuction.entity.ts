import { Column, Entity } from 'typeorm';
import { BaseEntity } from './_BaseEntity';

@Entity()
export class BackupAuction extends BaseEntity {
  @Column({ type: 'int' })
  auctionId: number;

  @Column({ type: 'numeric' })
  remainingTime: number; // FIXME: keep using minutes for easy testing

  @Column({ type: 'varchar' })
  joinedUserIds: string; // save with '1|2|3'

  @Column({ type: 'varchar' })
  currentWinner: string; // save with 'userId|price'
}
