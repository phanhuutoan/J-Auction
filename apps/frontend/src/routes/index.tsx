import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";
import SignupPage from "../pages/auth/Signup";
import LoginPage from "../pages/auth/Login";
import CreateItemPage from "../pages/CreateBidItem";
import DepositPage from "../pages/Deposit";
import BidOnAuctionPage from "../pages/BidOnAuction";
import Page404 from "../pages/others/404";

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
    path: "/auction-bid",
    element: <BidOnAuctionPage />,
  },
  {
    path: "*",
    element: <Page404 />,
  },
]);

export default router;
