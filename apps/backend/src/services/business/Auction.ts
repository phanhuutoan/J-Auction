import * as moment from 'moment';
import { IRawBackupAuctionData } from './backupAuctionManager.service';

export type UserId = number;
export type CurrentWinner = { userId: UserId; highestPrice: number };
export type EndCallBack = (
  currentWinner: CurrentWinner,
  losedUserIds: UserId[],
  bidId: number,
) => void;

export class Auction {
  private endCallback: EndCallBack;
  private timeoutMinutes: number;
  private bidItemId: number;
  private _currentWinner: CurrentWinner = {
    userId: 0,
    highestPrice: 0,
  };
  private joinedUserIdsSet = new Set<UserId>();
  private startTime: moment.Moment;
  private endTime: moment.Moment;

  private timeout: NodeJS.Timeout;
  private interval: NodeJS.Timer;

  // FIXME: I use minutes to easily test
  constructor(
    bidItemId: number,
    minutes: number,
    endCallback: EndCallBack,
    joinedUserId?: Set<UserId>,
    currentWinner?: CurrentWinner,
  ) {
    this.endCallback = endCallback;
    this.timeoutMinutes = minutes * 1000 * 60;
    this.bidItemId = bidItemId;
    this.startTime = moment();
    // FIXME: Minutes may be convert to hour when testing OK
    this.endTime = this.startTime.add(minutes, 'minutes');

    if (joinedUserId) {
      this.joinedUserIdsSet = joinedUserId;
    }

    if (currentWinner) {
      this._currentWinner = currentWinner;
    }

    // this.interval = setInterval(this.getRemainingTimes.bind(this), 10000); // FOR DEBUG PURPOSE

    this.startAuction();
  }

  public get currentWinner() {
    return this._currentWinner;
  }

  public get losedUserIds() {
    return Array.from(this.joinedUserIdsSet).filter(
      (userId) => userId !== this._currentWinner.userId,
    );
  }

  public getRemainingTimes() {
    const currentTime = moment().valueOf();
    const remainingTime = this.endTime.valueOf() - currentTime;
    const minutes = moment(remainingTime).minutes();
    const seconds = moment(remainingTime).seconds();

    const decimalMinutes = (minutes + seconds / 60).toFixed(2);
    // console.log('DECIMAL', decimalMinutes); // FOR DEBUG PURPOSE
    return decimalMinutes;
  }

  public checkHighestPrice(price: number) {
    if (price > this._currentWinner.highestPrice) {
      return true;
    } else {
      return false;
    }
  }

  public addHighestPrice(userId: UserId, price: number) {
    this._currentWinner = {
      highestPrice: price,
      userId,
    };
    this.addJoinedUserId(userId);
  }

  public getRawBackupData(): IRawBackupAuctionData {
    return {
      auctionId: this.bidItemId,
      joinedUserIds: Array.from(this.joinedUserIdsSet),
      currentWinner: this._currentWinner,
      remainingTime: Number(this.getRemainingTimes()),
    };
  }

  private addJoinedUserId(joinedUserId: UserId) {
    this.joinedUserIdsSet.add(joinedUserId);
  }

  private startAuction() {
    this.timeout = setTimeout(() => {
      console.log(
        `Auction id: ${this.bidItemId} just ended at ${moment().format(
          'DD-MMM-YYYY HH:mm:ss',
        )}`,
      );
      this.destroyTimer();
      this.endCallback(this.currentWinner, this.losedUserIds, this.bidItemId);
    }, this.timeoutMinutes);
  }

  private destroyTimer() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }
}
