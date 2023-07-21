import { ReactNode, createContext, useContext } from "react";
import { AuthStore } from "./stores/AuthStore";
import { initService } from "./services/_init";
import { UserStore } from "./stores/UserStore";

initService();

class RootStore {
  authStore: AuthStore;
  userStore: UserStore;

  constructor() {
    this.authStore = new AuthStore();
    this.userStore = new UserStore();
  }
}

export const StoreContext = createContext<null | RootStore>(null);

export function RootStoreProvider({ children }: { children: ReactNode }) {
  const store = new RootStore();

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useGetStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw Error("Store is NOT registered properly!!");
  }

  return context;
}
