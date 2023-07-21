import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { loginStyle } from "./styles";
import {} from "../../";
import { LayerStyleToken } from "../../themes/tokens";
import { useForm } from "react-hook-form";
import AppLink from "../../ui-components/AppLink";
import { useGetStore } from "../../stores-sdk";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type FormData = {
  email: string;
  password: string;
};

function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { authStore } = useGetStore();

  const _onSubmit = (data: FormData) => {
    setLoading(true);
    authStore.signin(data).finally(() => {
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
    <Box bgColor="purple.400" h="100vh" pt={"5rem"}>
      <Box color="white" as="h1" textAlign={"center"}>
        <Text layerStyle={LayerStyleToken.HEADING} mb=".5rem">
          Login!
        </Text>
        <Text textAlign={"center"} layerStyle={LayerStyleToken.SUB_HEADING}>
          Welcome to Tony's auction
        </Text>
      </Box>
      <Box sx={loginStyle.root}>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input type="email" {...register("email")} required />
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
            <Button isLoading={loading} type="submit" colorScheme="orange">
              Submit!
            </Button>
            <AppLink to="/auth/signup" color="blue">
              Register
            </AppLink>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}

export default observer(LoginPage);
