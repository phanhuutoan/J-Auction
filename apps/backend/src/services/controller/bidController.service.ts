import { BidInputData, CreateBidItemDTO } from 'src/common/DTOs/bidItem';
import { BidItemService } from '../transports/bidItem.service';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BidItemStateEnum } from 'src/entities/BidItem.entity';
import { BidItemId, BidManagerService } from '../business/bidManager.service';
import { PreventedUserActionManager } from '../business/PreventedUserAction.service';
import { UserService } from '../transports/user.service';
import { BidService } from '../transports/bid.service';

@Injectable()
export class BidControllerService {
  constructor(
    private bidManagerService: BidManagerService,
    private bidItemService: BidItemService,
    private userActionManager: PreventedUserActionManager,
    private userService: UserService,
    private bidService: BidService,
  ) {}

  createBidItem(userId: number, inputData: CreateBidItemDTO) {
    return this.bidItemService.create(userId, inputData);
  }

  getCompletedBidItem() {
    return this.bidItemService.getBidItems({
      state: BidItemStateEnum.COMPLETED,
    });
  }

  async getOngoingBidItem() {
    const bidItems = await this.bidItemService.getBidItems({
      state: BidItemStateEnum.ONGOING,
    });
    const bidItemsAndRemainingTime = bidItems.map((item) => {
      const remainingTime = this.bidManagerService.getRemainingTimeFromAuction(
        item.id,
      );
      const currentWinner = this.bidManagerService.getCurrentWinner(item.id);

      return {
        ...item,
        remainingTime,
        currentWinner,
      };
    });

    return bidItemsAndRemainingTime;
  }

  async updateStateOfBidItem(
    bidItemId: number,
    triggerUserId: number,
    state: BidItemStateEnum,
  ) {
    const bidItem = await this.bidItemService.getBidItemById(bidItemId, {
      createdBy: true,
    });

    if (bidItem.createdBy.id !== triggerUserId) {
      throw new BadRequestException(
        "You cannot start auction that you don't own",
      );
    }

    if (state === BidItemStateEnum.ONGOING) {
      await this.bidManagerService.startAution(
        Number(bidItemId),
        bidItem.timeWindow,
        bidItem.startPrice,
      );
    } else if (state === BidItemStateEnum.COMPLETED) {
      await this.bidManagerService.stopAuction(bidItem.id);
    }
  }

  async createBidOnAuction(bidInput: BidInputData) {
    const { bidItemId, biddingUserId } = bidInput;
    const canBid = this.userActionManager.checkUserCanBid(
      biddingUserId,
      bidItemId,
    );

    if (!canBid) {
      throw new BadRequestException(
        'You are bidding too fast! For each auction, you can only bid each 5s',
      );
    } else {
      this.userActionManager.setPreventUser(biddingUserId, bidItemId);
    }

    const checkResult = this.bidManagerService.checkHighestPrice(bidInput);

    if (checkResult === true) {
      // This order here is important
      // check balance of user and decuce it first
      await this.deductUserBalance(bidInput);
      // change the highest price
      this.bidManagerService.addHighestPrice(bidInput);
      // create a bid in DB
      await this.bidService.create(bidInput);
    } else if (checkResult instanceof UnprocessableEntityException) {
      throw checkResult;
    }
  }

  async getBidListFromItem(bidItemId: BidItemId) {
    const data = await this.bidItemService.getBidListOnBidItem(bidItemId);
    let remainingTime = null;

    if (data.state === BidItemStateEnum.ONGOING) {
      remainingTime =
        this.bidManagerService.getRemainingTimeFromAuction(bidItemId);
    }

    return {
      ...data,
      remainingTimeInMinutes: remainingTime,
    };
  }

  private async deductUserBalance(bidInput: BidInputData) {
    const { bidItemId, biddingUserId, price } = bidInput;
    const biddingUser = await this.userService.getUserDataById(biddingUserId);

    const highestBidFromUser =
      await this.bidService.getHighestBidFromUserOnBidItem(
        biddingUserId,
        bidItemId,
      );

    let highestPriceOfUser = 0;
    if (highestBidFromUser) {
      highestPriceOfUser = highestBidFromUser.price;
    }
    const deductedPrice = price - highestPriceOfUser;
    if (biddingUser.balance < deductedPrice) {
      throw new BadRequestException(
        'Your balance is insufficent. Please, deposit first!',
      );
    }

    const newBalance = biddingUser.balance - deductedPrice;
    await this.userService.updateUser(biddingUser, { balance: newBalance });
  }
}
