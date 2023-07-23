import { Fragment, useState } from "react";
import OngoingAuctionRow, { OngoingAuctionProps } from "./OngoingAuction";
import BidPriceModal, { BidPriceFormData } from "../modals/BidPriceModal";
import { useDisclosure } from "@chakra-ui/react";

export interface AuctionManagerProps {
  listAuction: OngoingAuctionProps[];
  onBidPrice(id: number, price: number): void;
  onEndTime(id: number): void;
}

export function AuctionManager(props: AuctionManagerProps) {
  const { listAuction, onBidPrice, onEndTime } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingId, setEditingId] = useState<number | null>(null);

  function _onBidPrice(data: BidPriceFormData) {
    if (editingId) {
      onBidPrice(editingId, data.price);
      setEditingId(null);
      onClose();
    }
  }

  return (
    <Fragment>
      {listAuction.map((auction) => {
        return (
          <OngoingAuctionRow
            key={auction.id}
            {...auction}
            onEndingTime={(id) => {
              onEndTime(id);
            }}
            onBidClick={(id) => {
              onOpen();
              setEditingId(id);
            }}
          />
        );
      })}

      <BidPriceModal isOpen={isOpen} onClose={onClose} onSubmit={_onBidPrice} />
    </Fragment>
  );
}
