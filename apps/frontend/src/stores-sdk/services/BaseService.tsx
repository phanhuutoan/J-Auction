import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ThemeProvider,
  theme,
  Text,
  Divider,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import axios, { AxiosError, AxiosInstance } from "axios";
import ReactDOM from "react-dom/client";
import { STORAGE_KEY_TOKEN } from "../models/constant";

export type ErrorPayload = { message: string; statusCode: number };
export class BaseService {
  private apiInstance: AxiosInstance;
  private readonly API = `http://${process.env.REACT_APP_API_HOST}`;
  private reactRoot?: ReactDOM.Root;

  constructor() {
    this.apiInstance = axios.create({
      baseURL: this.API,
      timeout: 2000,
    });

    this.apiInstance.interceptors.response.use(null, (err) => {
      this.errorHandler(err);
    });
  }

  private errorHandler(err: AxiosError<ErrorPayload>) {
    const element = document.createElement("div");
    element.id = "error-modal";
    document.body.appendChild(element);
    const modal = (
      <ThemeProvider theme={theme}>
        <Modal
          isOpen={true}
          onClose={this.closeModal.bind(this)}
          size={"md"}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader display={"flex"}>
              <WarningTwoIcon boxSize={"2rem"} color={"red.500"} mr="1rem" />
              <Text color={"red.600"}>An error occur!!</Text>
            </ModalHeader>
            <Divider my=".2rem" />
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize={".9rem"} fontWeight={"700"} mb=".5rem">
                ERROR CODE: {err.response?.data?.statusCode}
              </Text>
              <Text fontSize={"1.1rem"}>{err.response?.data?.message}</Text>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                onClick={this.closeModal.bind(this)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ThemeProvider>
    );

    this.reactRoot = ReactDOM.createRoot(element);
    this.reactRoot.render(modal);
  }

  private closeModal() {
    const ele = document.querySelector("#error-modal");
    if (ele) {
      this.reactRoot?.unmount();
      ele.parentElement?.removeChild(ele);
    }
  }

  protected axiosRequest(
    token?: string,
    errorHandler?: (err: AxiosError<ErrorPayload>) => void
  ) {
    const cachedToken = sessionStorage.getItem(STORAGE_KEY_TOKEN);
    if (token || cachedToken) {
      const bearerToken = token ? token : cachedToken;
      this.apiInstance.defaults.headers["Authorization"] =
        "Bearer " + bearerToken;
    }

    if (errorHandler) {
      this.apiInstance.interceptors.request.use(null, (err) => {
        errorHandler(err);
      });
    }

    return this.apiInstance;
  }
}
