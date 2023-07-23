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
import { Fragment, PropsWithChildren, useEffect } from "react";
import { layoutStyle } from "./styles";
import { Link, useNavigate } from "react-router-dom";
import { useGetStore } from "../../stores-sdk";
import { observer } from "mobx-react-lite";

interface CommonLayoutProps extends PropsWithChildren {}

function CommonLayout(props: CommonLayoutProps) {
  const avatarSrc =
    "https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg";

  const { authStore, userStore } = useGetStore();
  const navigate = useNavigate();

  useEffect(() => {
    authStore.autoSignin();
    if (authStore.token) {
      userStore.getCurrentUserData();
    } else {
      navigate("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function _logout() {
    authStore.logout();
    navigate("/auth/login");
  }

  return (
    <Fragment>
      <Flex sx={layoutStyle.root} color="white">
        <Link to="/">
          <Text fontWeight={"500"} fontSize={"1.3rem"}>
            Tony's Home
          </Text>
        </Link>
        <Flex alignItems={"center"}>
          <Box mr="1.5rem" textAlign={"right"}>
            <Text>
              Balance:{" "}
              <strong>${userStore.currentUser?.balance || "N/A"}</strong>
            </Text>
            <Text fontWeight={"500"} textTransform={"uppercase"}>
              {userStore.currentUser?.userName || "N/A"}{" "}
            </Text>
          </Box>
          <Menu>
            <MenuButton>
              <Avatar
                data-testid="AVATAR"
                cursor={"pointer"}
                src={avatarSrc}
                size={"md"}
              />
            </MenuButton>
            <MenuList color={"black"}>
              <Link to="/">
                <MenuItem>Home</MenuItem>
              </Link>
              {authStore.token ? (
                <Fragment>
                  <Link to="/create-item">
                    <MenuItem>Create new item</MenuItem>
                  </Link>
                  <Link to="/deposit">
                    <MenuItem>Deposit</MenuItem>
                  </Link>
                  <MenuItem onClick={_logout}>Logout</MenuItem>
                </Fragment>
              ) : (
                <Fragment>
                  <Link to="/auth/login">
                    <MenuItem>Login</MenuItem>
                  </Link>
                  <Link to="/auth/signup">
                    <MenuItem>Signup</MenuItem>
                  </Link>
                </Fragment>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box>{props.children}</Box>
    </Fragment>
  );
}

export default observer(CommonLayout);
