import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BidItemService } from '../transports/bidItem.service';
import { BidItemStateEnum } from 'src/entities/BidItem.entity';
import { Auction, CurrentWinner, UserId } from './Auction';
import { BidInputData } from 'src/common/DTOs/bidItem';
import { BidService } from '../transports/bid.service';
import { UserService } from '../transports/user.service';

export type BidItemId = number;

@Injectable()
export class BidManagerService {
  constructor(
    private bidItemService: BidItemService,
    private bidService: BidService,
    private userService: UserService,
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

  checkHighestPrice(bidInput: BidInputData) {
    const { bidItemId, price } = bidInput;
    const auction = this.getOngoingAuction(bidItemId);

    const result = auction.checkHighestPrice(price);

    if (result) {
      return true;
    } else {
      const highestPrice = auction.currentWinner.highestPrice;
      return new UnprocessableEntityException(
        `Your price is not the highest one, the current highest price is $"${highestPrice}". Please, try again!`,
      );
    }
  }

  addHighestPrice(bidInput: BidInputData) {
    const { bidItemId, price, biddingUserId } = bidInput;
    const auction = this.getOngoingAuction(bidItemId);

    auction.addHighestPrice(biddingUserId, price);
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
    await Promise.all([
      this.bidItemService.updateWinner(bidId, currentWinner.userId),
      this.sendBackMoneyToLosedUser(losedUserIds, bidId),
      this.stopAuction(bidId),
    ]);
    this.onGoingAuctionMap.delete(bidId);
  }

  private async sendBackMoneyToLosedUser(userIds: UserId[], bidId: BidItemId) {
    const userMoneyData = await this.bidService.getMoneyLosedUserBidInAuction(
      userIds,
      bidId,
    );
    const userMoneyDataMap = new Map(
      userMoneyData.map((data) => [data.userId, data.maxprice]),
    );
    const moneyBackUsers = await this.userService.getManyUsers(
      userMoneyData.map((u) => u.userId),
    );

    const updatedUserBalances = moneyBackUsers.map((user) => {
      const moneyUserHasBid = userMoneyDataMap.get(user.id);
      const newBalance = Number(user.balance) + Number(moneyUserHasBid);

      return {
        balance: newBalance,
      };
    });

    await this.userService.updateManyUsers(moneyBackUsers, updatedUserBalances);
  }
}
