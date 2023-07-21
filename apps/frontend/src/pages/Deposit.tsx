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

type FormData = {
  balance: number;
};

function DepositPage() {
  const { register, handleSubmit } = useForm<FormData>();
  function _onSubmit(data: FormData) {
    console.log("Data", data);
  }
  return (
    <CommonLayout>
      <Container maxW={"50rem"}>
        <Box my="2rem">
          <Text color="blue.600" fontSize={"1.8rem"}>
            Current balance <strong>$1000</strong>
          </Text>
        </Box>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <FormControl>
            <FormLabel>Your money: </FormLabel>
            <Input type="number" {...register("balance")} required />
          </FormControl>
          <Flex>
            <Button colorScheme="green" mt="1rem" ml="auto">
              Deposit
            </Button>
          </Flex>
        </form>
      </Container>
    </CommonLayout>
  );
}

export default DepositPage;
