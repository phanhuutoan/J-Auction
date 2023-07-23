import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidItem, BidItemStateEnum } from 'src/entities/BidItem.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateBidItemDTO } from 'src/common/DTOs/bidItem';
import { forOwn } from 'lodash';
import { BidItemId } from '../business/bidManager.service';

export interface IPossibleUpdateBidItemField {
  title: string;
  body: string;
  state: BidItemStateEnum;
  timeWindow: number;
}
@Injectable()
export class BidItemService {
  constructor(
    @InjectRepository(BidItem)
    private bidItemRepo: Repository<BidItem>,
  ) {}

  async create(userId: number, bidItemInput: CreateBidItemDTO) {
    const { timeWindow, title, body, startPrice } = bidItemInput;
    return this.bidItemRepo
      .createQueryBuilder('bidItem')
      .insert()
      .into(BidItem)
      .values([
        {
          timeWindow,
          title,
          body,
          startPrice,
          finalPrice: startPrice,
          createdBy() {
            return userId.toString();
          },
        },
      ])
      .execute();
  }

  async getBidItems(whereOptions: FindOptionsWhere<BidItem>) {
    return this.bidItemRepo.find({
      where: whereOptions,
      relations: {
        winner: true,
      },
    });
  }

  async getBidItemById(id: number, relations: FindOptionsRelations<BidItem>) {
    return this.bidItemRepo.findOne({ where: { id }, relations });
  }

  async updateBidItem(
    id: number,
    possibleUpdateField: Partial<IPossibleUpdateBidItemField>,
  ) {
    const updateData: Record<string, number | string> = {};

    forOwn(possibleUpdateField, (val, key) => {
      updateData[key] = val;
    });

    await this.bidItemRepo.update(id, {
      ...updateData,
    });
  }

  async updateWinner(bidItemId: number, userId: number, highestPrice: number) {
    if (!userId) {
      return;
    }
    await this.bidItemRepo.update(bidItemId, {
      finalPrice: highestPrice,
      winner() {
        return userId.toString();
      },
    });
  }

  async getBidListOnBidItem(bidItemId: BidItemId) {
    const bidItem = await this.bidItemRepo.findOne({
      where: { id: bidItemId },
      relations: { bids: { user: true } },
    });

    return bidItem;
  }
}
