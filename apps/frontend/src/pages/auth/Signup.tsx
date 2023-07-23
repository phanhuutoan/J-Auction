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
import { useGetStore } from "../../stores-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type FormData = {
  email: string;
  password: string;
  userName: string;
};

function SignupPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const { authStore } = useGetStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const _onSubmit = (data: FormData) => {
    setLoading(true);
    authStore.signup(data).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (authStore.token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.token]);

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
            <Input type="text" {...register("userName")} required />
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
            <Button type="submit" colorScheme="orange" isLoading={loading}>
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
