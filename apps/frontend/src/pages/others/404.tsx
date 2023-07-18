import { Text, Center, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <Center textAlign={"center"} mt="2rem" flexDir={"column"}>
      <Text fontSize={"2rem"} as="h1">
        404 Error! Page not found
      </Text>{" "}
      <br />
      <Box color="blue.500" fontSize={"1.5rem"}>
        <Link color="inherit" to="/">
          Go back home
        </Link>
      </Box>
    </Center>
  );
}

export default Page404;
