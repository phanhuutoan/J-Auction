export interface CreateBidItemDTO {
  title: string;
  body: string;
  // TODO: Testing purpose with minutes
  timeWindow: number;
  startPrice: number;
}

export interface StartBidDTO {
  bidItemId: number;
  timeWindow: number;
  createdById: number;
}

export interface BidInputData {
  biddingUserId: number;
  bidItemId: number;
  price: number;
}

export interface BidAuctionDTO {
  price: number;
}
