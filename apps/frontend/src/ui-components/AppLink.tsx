import { Box } from "@chakra-ui/react";
import { Link, LinkProps } from "react-router-dom";

interface AppLinkProps extends LinkProps {}

const AppLink = (props: AppLinkProps) => {
  return (
    <Box
      color="cyan.500"
      _hover={{
        a: {
          textDecor: "underline",
        },
      }}
    >
      <Link to={props.to} color="inherit">
        {props.children}
      </Link>
    </Box>
  );
};

export default AppLink;
