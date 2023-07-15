import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidInputData } from 'src/common/DTOs/bidItem';
import { Bid } from 'src/entities/Bid.entity';
import { Repository } from 'typeorm';

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
      .select(['price', 'userId', 'bidItemId'])
      .where('bid.userId = :userId AND bid.bidItemId = :bidItemId', {
        userId,
        bidItemId,
      })
      .orderBy({
        price: 'DESC',
      })
      .getOne();
  }
}
