import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { LayerStyleToken } from "../../themes/tokens";
import { loginStyle } from "./styles";
import { useForm } from "react-hook-form";
import AppLink from "../../ui-components/AppLink";

export type FormData = {
  email: string;
  password: string;
  name: string;
};

function SignupPage() {
  const { register, handleSubmit } = useForm<FormData>();

  const _onSubmit = (data: FormData) => {
    console.log("Data", data);
  };

  return (
    <Box bgColor="blue.400" h="100vh" pt={"5rem"}>
      <Box color="white" as="h1" textAlign={"center"}>
        <Text layerStyle={LayerStyleToken.HEADING} mb=".5rem">
          Signup!
        </Text>
        <Text textAlign={"center"} layerStyle={LayerStyleToken.SUB_HEADING}>
          Please, signup first!
        </Text>
      </Box>
      <Box sx={loginStyle.root}>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input type="email" {...register("email")} required />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Name</FormLabel>
            <Input type="name" {...register("name")} required />
          </FormControl>
          <FormControl mt="1rem">
            <FormLabel>Password</FormLabel>
            <Input type="password" {...register("password")} required />
          </FormControl>
          <Flex
            justifyContent={"space-between"}
            mt="2rem"
            alignItems={"center"}
          >
            <Button type="submit" colorScheme="orange">
              Submit!
            </Button>
            <AppLink to="/auth/login" color="blue">
              Have account? login
            </AppLink>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}

export default SignupPage;