import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Fragment, PropsWithChildren } from "react";
import { layoutStyle } from "./styles";
import { Link } from "react-router-dom";

interface CommonLayoutProps extends PropsWithChildren {}

function CommonLayout(props: CommonLayoutProps) {
  const avatarSrc =
    "https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg";
  return (
    <Fragment>
      <Flex sx={layoutStyle.root} color="white">
        <Text fontWeight={"500"} fontSize={"1.3rem"}>
          Tony's logo
        </Text>
        <Flex alignItems={"center"}>
          <Box mr="1.5rem">
            <Text>
              Balance: <strong>$1000</strong>
            </Text>
            <Text fontWeight={"500"}>Username </Text>
          </Box>
          <Menu>
            <MenuButton>
              <Avatar cursor={"pointer"} src={avatarSrc} size={"md"} />
            </MenuButton>
            <MenuList color={"black"}>
              <Link to="/create-item">
                <MenuItem>Create new item</MenuItem>
              </Link>
              <Link to="/deposit">
                <MenuItem>Deposit</MenuItem>
              </Link>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box>{props.children}</Box>
    </Fragment>
  );
}

export default CommonLayout;
