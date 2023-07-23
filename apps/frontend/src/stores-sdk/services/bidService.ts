import {
  CompletedBidItem,
  BidItemState,
  CommonUpdateReturn,
  BidItemWithBids,
} from "../models/model";
import { BaseService } from "./BaseService";

export class BidService extends BaseService {
  getBidItems<T extends CompletedBidItem>(state: BidItemState) {
    return this.axiosRequest().get<T[]>(`/bid/list`, {
      params: { state },
    });
  }

  bidPrice(itemId: number, price: number) {
    return this.axiosRequest().post<CommonUpdateReturn>(`/bid/${itemId}`, {
      price,
    });
  }

  getBidListOnAuction(itemId: number) {
    return this.axiosRequest().get<BidItemWithBids>(`/bid/${itemId}/list`);
  }
}
