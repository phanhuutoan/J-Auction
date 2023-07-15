export type EndTimeHanlder = (userId: number, bidItemId: number) => void;

export class UserBidAction {
  private readonly DELAY_TIME = 5; // seconds
  private onEndtime: EndTimeHanlder;
  private userId: number;
  private bidItemId: number;
  private timeout: NodeJS.Timeout;

  constructor(userId: number, bidItemId: number, onEndtime: EndTimeHanlder) {
    this.onEndtime = onEndtime;
    this.userId = userId;
    this.bidItemId = bidItemId;

    this.timeout = this.startCounting();
  }

  startCounting() {
    return setTimeout(() => {
      clearTimeout(this.timeout);
      this.onEndtime(this.userId, this.bidItemId);
    }, this.DELAY_TIME * 1000);
  }
}
