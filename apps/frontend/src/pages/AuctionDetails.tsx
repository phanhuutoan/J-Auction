import {
  Box,
  Button,
  Container,
  Flex,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import CommonLayout from "../ui-components/Layouts";
import { CommonEnum } from "../common/constant";
import GridHeader from "../ui-components/grids-item/GridHeader";
import GridRow from "../ui-components/grids-item/GridRow";
import BidPriceModal from "../ui-components/modals/BidPriceModal";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { BidItemState, LoaderData } from "../stores-sdk/models/model";
import { useRemainingTime } from "../common/hooks/useRemainingTime";
import moment from "moment";
import { useComponentUnmount } from "../common/hooks/useCleanupHook";
import { useEffect, useRef, useState } from "react";
import { useGetStore } from "../stores-sdk";
import { BidIcon } from "../ui-components/icons/bidIcon";
import { observer } from "mobx-react-lite";

const DELAY_TIME_POLLING = 5000; // 5s

function AuctionDetails() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bidItemId } = useParams();
  const navigate = useNavigate();
  const { bids: initialBids, bidItemInfo } = useLoaderData() as LoaderData;
  const { bidStore } = useGetStore();
  const headersItem = ["id", "Name", "Email", "Bid price", "Bid date"];

  const [bids, setBids] = useState(initialBids);
  const pollingInterval = useRef<any>()
  const timeout = useRef<any>()

  const isCompleted = bidItemInfo.state === BidItemState.COMPLETED;

  useEffect(() => {
    if (bidItemInfo.remainingTimeInMinutes !== null) {
      timeout.current = setTimeout(() => {
        timeout.current && navigate("/?state=completed");
      }, Number(bidItemInfo.remainingTimeInMinutes) * 1000 * 60);
    }

    if (!isCompleted) {
      pollingInterval.current = setInterval(() => {
        pollingInterval.current && _updateBid();
      }, DELAY_TIME_POLLING);
    }

  }, []);

  useComponentUnmount(() => {
    clearTimeout(timeout.current);
    clearInterval(pollingInterval.current);
    timeout.current = undefined;
    pollingInterval.current = undefined
  });

  const { formatStr } = useRemainingTime(
    Number(bidItemInfo?.remainingTimeInMinutes)
  );

  function _getRowData() {
    return bids.map((bid) => {
      const { id, user, price, createdAt } = bid;
      return [
        id,
        user.userName,
        user.email,
        `$${price}`,
        moment(createdAt).format("DD-MMM-YYYY hh:mm:ss"),
      ];
    });
  }

  function _updateBid() {
    bidStore.getAuctionWithBid(Number(bidItemId)).then((data) => {
      setBids(data?.bids || []);
    });
  }

  function _submitPrice(price: number) {
    if (bidItemId) {
      bidStore.bidPrice(Number(bidItemId), price).then(() => {
        _updateBid();
      });
    }
  }

  return (
    <CommonLayout>
      <Box>
        <Container maxW={CommonEnum.CONTAINER_WIDTH} mt="2rem">
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            mb="1.5rem"
          >
            <Box>
              <Text fontSize={"1.6rem"} fontWeight={"500"}>
                {bidItemInfo.title}
              </Text>
              <Text>{bidItemInfo.body}</Text>
            </Box>

            <Box p="1rem" border=".3rem solid" borderColor="red.700">
              <Text fontSize={"1.2rem"} color="red.800" fontWeight={"500"}>
                {isCompleted
                  ? `Auction was completed!`
                  : `Auction is ongoing: ${formatStr}`}
              </Text>
            </Box>

            <Button
              colorScheme="purple"
              minW={"5rem"}
              onClick={onOpen}
              isDisabled={isCompleted}
            >
              Bid
            </Button>
          </Flex>

          <Box>
            <GridHeader items={headersItem} />
            {_getRowData().map((row) => (
              <GridRow
                key={row[0]}
                items={row}
                Icon={<BidIcon fill="white" />}
                iconBoxBg="yellow.700"
              />
            ))}
          </Box>
        </Container>

        <BidPriceModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={(data) => _submitPrice(data.price)}
        />
      </Box>
    </CommonLayout>
  );
}

export default observer(AuctionDetails);
