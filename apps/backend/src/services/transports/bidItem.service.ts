import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidItem } from 'src/entities/BidItem.entity';
import { Repository } from 'typeorm';
import { CreateBidItemDTO } from 'src/common/DTOs/bidItem';

@Injectable()
export class BidItemService {
  constructor(
    @InjectRepository(BidItem)
    private bidItemRepo: Repository<BidItem>,
  ) {}

  async create(userId: number, bidItemInput: CreateBidItemDTO) {
    const { timeWindow, title, body } = bidItemInput;
    await this.bidItemRepo
      .createQueryBuilder('bidItem')
      .insert()
      .into(BidItem)
      .values([
        {
          timeWindow,
          title,
          body,
          createdBy() {
            return userId.toString();
          },
        },
      ])
      .execute();
  }
}
