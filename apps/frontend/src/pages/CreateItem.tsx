import { Box, Button, Container, Flex, useDisclosure } from "@chakra-ui/react";
import { CommonEnum } from "../common/constant";
import CommonLayout from "../ui-components/Layouts";
import GridHeader from "../ui-components/grids-item/GridHeader";
import GridRow from "../ui-components/grids-item/GridRow";
import CreateItemModal, {
  CreateItemFormData,
} from "../ui-components/modals/CreateItemModal";
import { useGetStore } from "../stores-sdk";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { BidIconUser } from "../ui-components/icons/bidIcon";

function CreateItemPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userStore } = useGetStore();

  const headersItem = [
    "ID",
    "Item name",
    "state",
    "time window",
    "started price",
    "Actions",
  ];

  function _onCreateItem(data: CreateItemFormData) {
    const { name, ...rest } = data;
    userStore.createBidItem({
      title: name,
      ...rest,
    });
  }

  useEffect(() => {
    userStore.getMyBidItemRow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            {userStore.bidItemRows.map((row) => (
              <GridRow
                key={row[0]}
                items={row}
                Icon={<BidIconUser fill={"white"} />}
                iconBoxBg="purple.500"
              />
            ))}
          </Box>
        </Container>

        <CreateItemModal
          onSubmit={_onCreateItem}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Box>
    </CommonLayout>
  );
}

export default observer(CreateItemPage);
