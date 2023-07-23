/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button } from "@chakra-ui/react";
import GridRow from "../grids-item/GridRow";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useRemainingTime } from "../../common/hooks/useRemainingTime";
import { OngoingAuctionItem } from "../../stores-sdk/models/model";
import { RepeatClockIcon } from "@chakra-ui/icons";

export interface OngoingAuctionProps extends OngoingAuctionItem {
  onBidClick?(bidId: number): void;
  onEndingTime?(bidId: number): void;
}

function OngoingAuctionRow(props: OngoingAuctionProps) {
  const {
    id,
    title,
    currentHighestPrice,
    remainingTimeInMinutes,
    onBidClick,
    onEndingTime,
  } = props;

  const { formatStr } = useRemainingTime(remainingTimeInMinutes);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onEndingTime?.(id);
    }, remainingTimeInMinutes * 1000 * 60);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  function _onBidClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    onBidClick?.(id);
  }
  const row = [
    id,
    title,
    currentHighestPrice,
    formatStr,
    <Button colorScheme="purple" onClick={_onBidClick}>
      Bid now!
    </Button>,
  ];

  return (
    <Box>
      <Link to={`/${row[0]}/bids?state=ongoing`}>
        <GridRow
          data-testid="ONGOING_AUCTION"
          key={row[0] as number}
          items={row}
          Icon={<RepeatClockIcon />}
          iconBoxBg="green.600"
        />
      </Link>
    </Box>
  );
}

export default OngoingAuctionRow;
