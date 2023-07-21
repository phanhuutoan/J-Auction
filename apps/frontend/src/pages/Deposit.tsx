import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import CommonLayout from "../ui-components/Layouts";
import { useForm } from "react-hook-form";
import { useGetStore } from "../stores-sdk";
import { useState } from "react";
import { observer } from "mobx-react-lite";

type FormData = {
  balance: number;
};

function DepositPage() {
  const { register, handleSubmit, resetField } = useForm<FormData>();
  const { userStore } = useGetStore();
  const [loading, setLoading] = useState<boolean>(false);

  function _onSubmit(data: FormData) {
    setLoading(true);
    userStore.updateBalance(data.balance).finally(() => {
      setLoading(false);
      resetField("balance");
    });
  }
  return (
    <CommonLayout>
      <Container maxW={"50rem"}>
        <Box my="2rem">
          <Text color="blue.600" fontSize={"1.8rem"}>
            Current balance{" "}
            <strong>${userStore.currentUser?.balance || 0}</strong>
          </Text>
        </Box>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <FormControl>
            <FormLabel>Your money: </FormLabel>
            <Input type="number" {...register("balance")} required />
          </FormControl>
          <Flex>
            <Button
              type="submit"
              isLoading={loading}
              colorScheme="green"
              mt="1rem"
              ml="auto"
            >
              Deposit
            </Button>
          </Flex>
        </form>
      </Container>
    </CommonLayout>
  );
}

export default observer(DepositPage);
