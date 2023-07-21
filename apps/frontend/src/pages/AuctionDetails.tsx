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

function AuctionDetails() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const headersItem = ["Name", "Bid price", "Time"];
  const rows: Array<[string, string, string]> = [
    ["user A", "$200", "4/30/2023 23:59"],
    ["user B", "$100", "4/30/2023 23:59"],
  ];
  return (
    <CommonLayout>
      <Box>
        <Container maxW={CommonEnum.CONTAINER_WIDTH} mt="2rem">
          <Flex alignItems={"center"} mb="1.5rem">
            <Box>
              <Text fontSize={"1.6rem"} fontWeight={"500"}>
                A Fan Auction!
              </Text>
              <Text>Some information about Fan Auction</Text>
            </Box>
            <Button
              colorScheme="purple"
              minW={"5rem"}
              ml="auto"
              onClick={onOpen}
            >
              Bid
            </Button>
          </Flex>

          <Box>
            <GridHeader items={headersItem} />
            {rows.map((row) => (
              <GridRow key={row[0]} items={row} />
            ))}
          </Box>
        </Container>

        <BidPriceModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </CommonLayout>
  );
}

export default AuctionDetails;
