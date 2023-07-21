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
export interface BidItem {
  id: number;
  title: string;
  body: string;
  startPrice: string;
  state: BidItemState;
  timeWindow: number;
}
