import { defineStyle } from "@chakra-ui/react";

export const gridStyles = defineStyle({
  row: {
    p: "1.5rem",
    borderRadius: ".5rem",
    border: "1px solid",
    borderColor: "gray.200",
    mb: "1rem",
    transition: "all .3s",
    alignItems: "center",
    cursor: "pointer",
    pos: "relative",
    _hover: {
      transform: "translateY(-3px)",
      boxShadow: "md",
    },
  },

  icon: {
    borderRadius: "50%",
    boxSize: "1.5rem",
    pos: "absolute",
    top: "-.5rem",
    left: "-.5rem",
  },
});
