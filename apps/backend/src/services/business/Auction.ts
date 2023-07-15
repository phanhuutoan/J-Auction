import * as moment from 'moment';

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
  private timeOut: NodeJS.Timeout;
  private bidItemId: number;
  private _currentWinner: CurrentWinner = {
    userId: null,
    highestPrice: 0,
  };
  private joinedUserIdsSet = new Set<UserId>();
  private startTime: moment.Moment;
  private endTime: moment.Moment;

  // FIXME: I use minutes to test
  constructor(bidItemId: number, minutes: number, endCallback: EndCallBack) {
    this.endCallback = endCallback;
    this.timeoutMinutes = minutes * 1000 * 60;
    this.bidItemId = bidItemId;
    this.startTime = moment();
    // FIXME: Minutes may be convert to hour when testing OK
    this.endTime = this.startTime.add(minutes, 'minutes');

    setInterval(this.getRemainingTimes.bind(this), 10000);

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

    console.log(
      `REMAINING TIME of bidId ${this.bidItemId}`,
      moment(remainingTime).format('hh:mm:ss'),
    );

    return moment(remainingTime);
  }

  public checkAndBidHighestPrice(userId: UserId, price: number) {
    this.addJoinedUserId(userId);
    if (price > this._currentWinner.highestPrice) {
      this._currentWinner = { userId, highestPrice: price };
      return true;
    } else {
      return false;
    }
  }

  private addJoinedUserId(joinedUserId: UserId) {
    this.joinedUserIdsSet.add(joinedUserId);
  }

  private startAuction() {
    this.timeOut = setTimeout(() => {
      console.log(
        `Auction id: ${
          this.bidItemId
        } just ended at ${Date.now().toLocaleString()}`,
      );
      this.destroyTimer();
      this.endCallback(this.currentWinner, this.losedUserIds, this.bidItemId);
    }, this.timeoutMinutes);
  }

  private destroyTimer() {
    clearTimeout(this.timeOut);
  }
}
