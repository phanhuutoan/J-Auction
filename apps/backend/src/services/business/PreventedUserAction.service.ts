import { Injectable } from '@nestjs/common';
import { UserId } from './Auction';
import { BidItemId } from './bidManager.service';
import { UserBidAction } from './UserBidAction';

export type CombinedBidId = `${UserId}_${BidItemId}`;

@Injectable()
export class PreventedUserActionManager {
  private preventingUserMap = new Map<CombinedBidId, UserBidAction>();

  public checkUserCanBid(userId: UserId, bidId: BidItemId) {
    const combinedId = this.createCombineId(userId, bidId);
    return !this.preventingUserMap.has(combinedId);
  }

  public setPreventUser(userId: UserId, bidId: BidItemId) {
    const combinedId = this.createCombineId(userId, bidId);
    const preventingUserAction = new UserBidAction(
      userId,
      bidId,
      this.preventEndtimeHanlder.bind(this),
    );

    this.preventingUserMap.set(combinedId, preventingUserAction);
  }

  private preventEndtimeHanlder(userId: UserId, bidId: BidItemId) {
    const combinedId = this.createCombineId(userId, bidId);

    this.preventingUserMap.delete(combinedId);
  }

  private createCombineId(userId: number, bidItemId: number): CombinedBidId {
    return `${userId}_${bidItemId}`;
  }
}
