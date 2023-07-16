import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidItem, BidItemStateEnum } from 'src/entities/BidItem.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  async getBidItems(whereOptions: FindOptionsWhere<BidItem>) {
    return this.bidItemRepo.find({
      where: whereOptions,
    });
  }

  async getBidItemById(id: number) {
    return this.bidItemRepo.findOneBy({ id });
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

  async updateWinner(bidItemId: number, userId: number) {
    await this.bidItemRepo.update(bidItemId, {
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

    return bidItem.bids;
  }
}
