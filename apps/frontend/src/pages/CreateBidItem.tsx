import { Box, Button, Container, Flex, useDisclosure } from "@chakra-ui/react";
import { CommonEnum } from "../common/constant";
import CommonLayout from "../ui-components/Layouts";
import GridHeader from "../ui-components/grids-item/GridHeader";
import GridRow from "../ui-components/grids-item/GridRow";
import CreateItemModal from "../ui-components/modals/CreateItemPrice";

function CreateItemPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const headersItem = [
    "Item name",
    "state",
    "time window",
    "started price",
    "Publish",
  ];
  const rows: Array<[string, string, string, string, JSX.Element]> = [
    [
      "A Fan",
      "private",
      "4 minutes",
      "$50",
      <Button colorScheme="orange">Publish</Button>,
    ],
    [
      "A pencil",
      "private",
      "4 minutes",
      "$100",
      <Button colorScheme="orange">Publish</Button>,
    ],
  ];
  return (
    <CommonLayout>
      <Box>
        <Container maxW={CommonEnum.CONTAINER_WIDTH} mt="2rem">
          <Flex>
            <Button colorScheme="purple" minW={"5rem"} onClick={onOpen}>
              Create new item
            </Button>
          </Flex>

          <Box>
            <GridHeader items={headersItem} />
            {rows.map((row) => (
              <GridRow key={row[0]} items={row} />
            ))}
          </Box>
        </Container>

        <CreateItemModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </CommonLayout>
  );
}

export default CreateItemPage;
