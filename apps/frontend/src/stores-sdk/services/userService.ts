import { AxiosResponse } from "axios";
import { CreateItemDTO } from "../models/DTOs";
import { CompletedBidItem, CommonUpdateReturn, User } from "../models/model";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
  getUserData() {
    return this.axiosRequest().get<User>("/user");
  }

  updateUserBalance(balance: number) {
    return this.axiosRequest().patch<CommonUpdateReturn>("/user/balance", {
      balance,
    });
  }

  getMyBidItem() {
    return this.axiosRequest().get<CompletedBidItem[]>("/user/bid-items");
  }

  startBidItem(bidItemId: number) {
    return this.axiosRequest().post<CommonUpdateReturn>(
      `/bid/start/${bidItemId}`
    );
  }

  createItem(input: CreateItemDTO) {
    const { title, body, startPrice, timeWindow } = input;
    return this.axiosRequest().post<
      any,
      AxiosResponse<CommonUpdateReturn>,
      CreateItemDTO
    >("/bid/create", {
      title,
      body,
      startPrice,
      timeWindow,
    });
  }
}
