import { ReactNode, createContext, useContext } from "react";
import { AuthStore } from "./stores/AuthStore";
import { initService } from "./services/_init";
import { UserStore } from "./stores/UserStore";
import { BidStore } from "./stores/BidStore";

initService();

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  bidStore: BidStore;

  constructor() {
    this.authStore = new AuthStore();
    this.userStore = new UserStore();
    this.bidStore = new BidStore(this);
  }
}

export const StoreContext = createContext<null | RootStore>(null);

export const rootStore = new RootStore();

export function RootStoreProvider({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
}

export function useGetStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw Error("Store is NOT registered properly!!");
  }

  return context;
}
