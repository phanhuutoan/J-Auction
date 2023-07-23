import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";
import SignupPage from "../pages/auth/Signup";
import LoginPage from "../pages/auth/Login";
import CreateItemPage from "../pages/CreateItem";
import DepositPage from "../pages/Deposit";
import AuctionDetails from "../pages/AuctionDetails";
import Page404 from "../pages/others/404";
import { rootStore } from "../stores-sdk";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/signup",
    element: <SignupPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/create-item",
    element: <CreateItemPage />,
  },
  {
    path: "/deposit",
    element: <DepositPage />,
  },
  {
    path: "/:bidItemId/bids",
    element: <AuctionDetails />,
    loader: async ({ params }) => {
      const { bidStore } = rootStore;
      const id = Number(params.bidItemId);
      const loadedData = await bidStore.getAuctionWithBid(id);

      return loadedData;
    },
  },
  {
    path: "*",
    element: <Page404 />,
  },
]);

export default router;
