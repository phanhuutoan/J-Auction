import { Box, Button, Container, Flex, useDisclosure } from "@chakra-ui/react";
import CommonLayout from "../ui-components/Layouts";
import { CommonEnum } from "../common/constant";
import GridHeader from "../ui-components/grids-item/GridHeader";
import GridRow from "../ui-components/grids-item/GridRow";
import BidPriceModal from "../ui-components/modals/BidPriceModal";
import { Link } from "react-router-dom";
import React from "react";

function HomePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const headersItem = ["Name", "Current price", "Duration", "Bid"];

  function _onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    onOpen();
  }
  const rows: Array<[string, string, string, JSX.Element]> = [
    [
      "Item 1",
      "$200",
      "2.33",
      <Button colorScheme="purple" minW={"5rem"} onClick={_onClick}>
        Bid
      </Button>,
    ],
    [
      "Item 2",
      "$200",
      "2.44",
      <Button colorScheme="purple" minW={"5rem"}>
        Bid
      </Button>,
    ],
  ];

  return (
    <CommonLayout>
      <Container maxW={CommonEnum.CONTAINER_WIDTH} mt="2rem">
        <Flex>
          <Button colorScheme="green" mr={4}>
            Ongoing
          </Button>
          <Button colorScheme="yellow">Completed</Button>
        </Flex>

        <Box>
          <GridHeader items={headersItem} />
          {rows.map((row) => (
            <Link to={`/${1}/bids`}>
              <GridRow key={row[0]} items={row} />
            </Link>
          ))}
        </Box>
      </Container>

      <BidPriceModal isOpen={isOpen} onClose={onClose} />
    </CommonLayout>
  );
}

export default HomePage;
