import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BidItemService } from '../transports/bidItem.service';
import { BidItemStateEnum } from 'src/entities/BidItem.entity';
import { Auction, CurrentWinner, UserId } from './Auction';
import { BidService } from '../transports/bid.service';
import { BidInputData } from 'src/common/DTOs/bidItem';

export type BidItemId = number;

@Injectable()
export class BidManagerService {
  constructor(
    private bidItemService: BidItemService,
    private bidService: BidService,
  ) {}
  private onGoingAuctionMap = new Map<BidItemId, Auction>();

  async startAution(id: number, timeWindow: number) {
    await this.bidItemService.updateBidItem(id, {
      state: BidItemStateEnum.ONGOING,
    });
    const auction = new Auction(
      id,
      timeWindow,
      this.actionEndtimeHanlder.bind(this),
    );

    this.onGoingAuctionMap.set(id, auction);
  }

  async stopAuction(id: number) {
    await this.bidItemService.updateBidItem(id, {
      state: BidItemStateEnum.COMPLETED,
    });
  }

  async createBidOnAuction(bidInput: BidInputData) {
    const { bidItemId } = bidInput;
    const auction = this.getOngoingAuction(bidItemId);

    const isHighestResult = this.checkIfUserBidHighestPrice(bidInput);

    if (isHighestResult) {
      await this.bidService.create(bidInput);
    } else {
      const highestPrice = auction.currentWinner.highestPrice;
      throw new UnprocessableEntityException(
        `Your price is not the highest one, the current highest price is $"${highestPrice}". Please, try again!`,
      );
    }
  }

  checkIfUserBidHighestPrice(bidInput: BidInputData) {
    const { bidItemId, biddingUserId, price } = bidInput;
    const auction = this.getOngoingAuction(bidItemId);

    return auction.checkAndBidHighestPrice(biddingUserId, price);
  }

  getRemainingTimeFromAuction(id: BidItemId) {
    const auction = this.getOngoingAuction(id);

    return auction.getRemainingTimes().valueOf();
  }

  private getOngoingAuction(id: BidItemId) {
    const auction = this.onGoingAuctionMap.get(id);

    if (!auction) {
      throw new NotFoundException(
        'This auction is completed or not publish yet',
      );
    }

    return auction;
  }

  private async actionEndtimeHanlder(
    currentWinner: CurrentWinner,
    losedUserIds: UserId[],
    bidId: number,
  ) {
    console.log('Winner', currentWinner);
    console.log('LosedUserId', losedUserIds);
    await this.stopAuction(bidId);
    this.onGoingAuctionMap.delete(bidId);
  }
}
