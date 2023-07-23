export interface User {
  id: number;
  userName: string;
  balance: string;
  email: string;
}

export interface CommonUpdateReturn {
  status: string;
}

export enum BidItemState {
  ONGOING = "ongoing",
  PRIVATE = "private",
  COMPLETED = "completed",
}
export interface CompletedBidItem {
  id: number;
  title: string;
  body: string;
  startPrice: string;
  finalPrice: string;
  state: BidItemState;
  timeWindow: number;
  winner: User;
  updatedAt: string;
}

export interface OngoingBidItem extends CompletedBidItem {
  remainingTime: string;
  currentWinner: {
    userId: number;
    highestPrice: number;
  };
}

export interface BidOnAuction {
  id: number;
  createdAt: string;
  price: string;
  user: User;
}

export interface BidItemWithBids extends CompletedBidItem {
  remainingTimeInMinutes: number | null;
  bids: BidOnAuction[];
}

export interface LoaderData {
  bidItemInfo: Omit<BidItemWithBids, "bids">;
  bids: BidOnAuction[];
}

export interface RouteLoaderBids {
  bidRows: ItemRow[];
  completedAuctionData: CompletedBidItem | undefined;
  ongoingAuctionData: OngoingAuctionItem | undefined;
}

export type ItemRow = [number, string, string, string, string];
export type OngoingAuctionItem = {
  title: string;
  id: number;
  body: string;
  currentHighestPrice: number;
  remainingTimeInMinutes: number;
};
