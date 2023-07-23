import { BidItemState, type User } from "../models/model";
import { UserService } from "../services/userService";
import { getService } from "../services/serviceSingleton";
import { makeAutoObservable, runInAction } from "mobx";
import { Button } from "@chakra-ui/react";
import { CreateItemDTO } from "../models/DTOs";

export type BidItemRow = [number, string, string, string, string, JSX.Element];

export class UserStore {
  currentUser?: User;
  bidItemRows: Array<BidItemRow> = [];

  private userService: UserService;

  constructor() {
    this.userService = getService(UserService);

    makeAutoObservable(this);
  }

  async updateBalance(balance: number) {
    const resp = await this.userService.updateUserBalance(balance);

    if (resp.data.status) {
      runInAction(() => {
        if (this.currentUser) {
          this.currentUser.balance = (
            Number(this.currentUser.balance) + Number(balance)
          ).toString();
        }
      });
    }
  }

  async getCurrentUserData(forceUpdate?: boolean) {
    if (!this.currentUser || forceUpdate) {
      const resp = await this.userService.getUserData();

      if (resp) {
        runInAction(() => {
          this.currentUser = resp.data;
        });
      }
    }
  }

  async getMyBidItemRow(): Promise<void> {
    const resp = await this.userService.getMyBidItem();

    const rowData = resp.data
      .sort((bA, bB) => bB.id - bA.id)
      .map((bidItem) => {
        const { title, id, startPrice, state, timeWindow } = bidItem;
        return [
          id,
          title,
          state,
          `${timeWindow} minutes`,
          `$${startPrice}`,
          this.renderPublishButton(id, state !== BidItemState.PRIVATE),
        ] as BidItemRow;
      });

    runInAction(() => {
      this.bidItemRows = rowData;
    });
  }

  async createBidItem(payload: CreateItemDTO) {
    const resp = await this.userService.createItem(payload);
    if (resp.data.status) {
      return this.getMyBidItemRow();
    }
  }

  private renderPublishButton(id: number, isDisabled: boolean) {
    return (
      <Button
        colorScheme="orange"
        onClick={this.publishAuction.bind(this, id)}
        isDisabled={isDisabled}
      >
        Publish
      </Button>
    );
  }

  // mean start an auction
  private async publishAuction(id: number) {
    const resp = await this.userService.startBidItem(id);

    if (resp.data.status) {
      await this.getMyBidItemRow();
    }
  }
}
