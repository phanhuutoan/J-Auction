import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidInputData } from 'src/common/DTOs/bidItem';
import { Bid } from 'src/entities/Bid.entity';
import { Repository } from 'typeorm';
import { UserId } from '../business/Auction';

export interface GroupDataUserMoney {
  userId: number;
  maxprice: string;
}
@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepo: Repository<Bid>,
  ) {}

  async create(bidInput: BidInputData) {
    const { bidItemId, biddingUserId, price } = bidInput;
    await this.bidRepo
      .createQueryBuilder('bid')
      .insert()
      .into(Bid)
      .values({
        price,
        bidItem() {
          return bidItemId.toString();
        },
        user() {
          return biddingUserId.toString();
        },
      })
      .execute();
  }

  async getHighestBidFromUserOnBidItem(userId: number, bidItemId: number) {
    return this.bidRepo
      .createQueryBuilder('bid')
      .select(['bid.price', 'bid.userId', 'bid.bidItemId'])
      .where('bid.userId = :userId AND bid.bidItemId = :bidItemId', {
        userId,
        bidItemId,
      })
      .orderBy('bid.price', 'DESC')
      .getOne();
  }

  async getMoneyLosedUserBidInAuction(
    losedUserIds: UserId[],
    bidItemId: number,
  ) {
    const data = await this.bidRepo
      .createQueryBuilder('bid')
      .select(['bid.userId', 'MAX(bid.price) as maxprice'])
      .where('bid.userId IN (:...losedUserIds)', { losedUserIds })
      .andWhere('bid.bidItemId = :bidItemId', { bidItemId })
      .groupBy('bid.userId')
      .getRawMany();

    return data as GroupDataUserMoney[];
  }
}
