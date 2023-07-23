import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import CommonLayout from "../ui-components/Layouts";
import GridHeader from "../ui-components/grids-item/GridHeader";
import GridRow from "../ui-components/grids-item/GridRow";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetStore } from "../stores-sdk";
import { observer } from "mobx-react-lite";
import { AuctionManager } from "../ui-components/auctions/AuctionManager";
import { useCleanupHook as useComponentUnmount } from "../common/hooks/useCleanupHook";
import { CheckIcon } from "@chakra-ui/icons";

function HomePage() {
  const { bidStore } = useGetStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const headersOngoingItems = [
    "Id",
    "Name",
    "Current highest price",
    "Remaining time",
    "Actions",
  ];
  const headerCompletedItems = [
    "Id",
    "Name",
    "Highest price",
    "Winner user",
    "Finished date",
  ];

  useEffect(() => {
    if (searchParams.get("state") === "completed") {
      bidStore.getCompletedItem();
    } else {
      bidStore.getOngoingItems(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useComponentUnmount(() => {
    bidStore.clearRealtimeUpdate();
  });

  function _onGoingClick() {
    bidStore.getOngoingItems();

    navigate("./?state=ongoing");
  }

  function _onCompletedClick() {
    bidStore.getCompletedItem();

    navigate("./?state=completed");
  }

  return (
    <CommonLayout>
      <Container maxW={"75rem"} mt="2rem">
        <Tabs defaultIndex={searchParams.get("state") === "completed" ? 1 : 0}>
          <TabList>
            <Tab onClick={_onGoingClick}>On-going</Tab>
            <Tab onClick={_onCompletedClick}>Completed</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box>
                <GridHeader items={headersOngoingItems} />
                <AuctionManager
                  listAuction={bidStore.onGoingBidItem}
                  onBidPrice={bidStore.bidPrice.bind(bidStore)}
                  onEndTime={bidStore.removeBidItemWhenEndTime.bind(bidStore)}
                />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <GridHeader items={headerCompletedItems} />
                {bidStore.completedBidItemRows.map((row) => (
                  <Link to={`/${row[0]}/bids?state=completed`} key={row[0]}>
                    <GridRow
                      items={row}
                      Icon={<CheckIcon />}
                      iconBoxBg="red.700"
                    />
                  </Link>
                ))}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </CommonLayout>
  );
}

export default observer(HomePage);
