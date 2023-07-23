import { makeAutoObservable, runInAction } from "mobx";
import {
  BidItemState,
  ItemRow,
  OngoingAuctionItem,
  OngoingBidItem,
} from "../models/model";
import { BidService } from "../services/bidService";
import { getService } from "../services/serviceSingleton";
import { UserStore } from "./UserStore";
import { RootStore } from "..";
import moment from "moment";

const UPDATE_DELAY = 5000;

export class BidStore {
  private bidService: BidService;
  private userStore: UserStore;

  private timer?: NodeJS.Timer;

  completedBidItemRows: ItemRow[] = [];
  onGoingBidItem: OngoingAuctionItem[] = [];

  constructor(rootStore: RootStore) {
    this.bidService = getService(BidService);
    this.userStore = rootStore.userStore;

    makeAutoObservable(this);
  }

  async getCompletedItem() {
    const resp = await this.bidService.getBidItems(BidItemState.COMPLETED);

    if (resp?.data) {
      runInAction(() => {
        this.completedBidItemRows = resp.data
          .sort((iA, iB) => iB.id - iA.id)
          .map((item) => {
            const { id, title, finalPrice, updatedAt } = item;
            return [
              id,
              title,
              finalPrice,
              item.winner?.email,
              moment(updatedAt).format("DD-MMM-YYYY"),
            ];
          });
      });
    }
  }

  // Use polling realtime here
  async getOngoingItems(realtime?: boolean) {
    this.updateOngoingItems();

    if (realtime && !this.timer) {
      this.timer = setInterval(
        this.updateOngoingItems.bind(this),
        UPDATE_DELAY
      );
    }
  }

  async clearRealtimeUpdate() {
    clearInterval(this.timer);
  }

  private async updateOngoingItems() {
    const resp = await this.bidService.getBidItems<OngoingBidItem>(
      BidItemState.ONGOING
    );

    if (resp?.data) {
      runInAction(() => {
        this.onGoingBidItem = resp.data
          .sort((iA, iB) => iB.id - iA.id)
          .map((item) => {
            const { id, title, remainingTime, currentWinner, body } = item;
            return {
              id,
              body,
              title,
              currentHighestPrice: currentWinner.highestPrice,
              remainingTimeInMinutes: Number(remainingTime),
            };
          });
      });
    }
  }

  async bidPrice(itemId: number, price: number) {
    const resp = await this.bidService.bidPrice(itemId, price);

    if (resp?.data.status) {
      const updatedBidItem = this.onGoingBidItem.find(
        (item) => item.id === itemId
      );

      if (updatedBidItem) {
        updatedBidItem.currentHighestPrice = price;

        runInAction(() => {
          this.onGoingBidItem = [...this.onGoingBidItem];
        });
        // update current user data
        this.userStore.getCurrentUserData(true);
      }
    }
  }

  async removeBidItemWhenEndTime(itemId: number) {
    this.onGoingBidItem = this.onGoingBidItem.filter(
      (item) => item.id === itemId
    );
    // update current user data
    this.userStore.getCurrentUserData(true);
  }

  async getAuctionWithBid(itemId: number) {
    const resp = await this.bidService.getBidListOnAuction(itemId);
    if (resp?.data) {
      const { bids, ...rest } = resp.data;
      return {
        bidItemInfo: rest,
        bids: bids.sort((bA, bB) => bB.id - bA.id),
      };
    }

    return null;
  }
}
