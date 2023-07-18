import { extendTheme } from "@chakra-ui/react";
import { layerStyle } from "./layerStyle";

export const theme = extendTheme({
  layerStyles: layerStyle,
});
