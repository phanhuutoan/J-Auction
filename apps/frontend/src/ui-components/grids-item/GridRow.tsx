import {
  Center,
  GridItem,
  IconProps,
  SimpleGrid,
  SimpleGridProps,
  Text,
} from "@chakra-ui/react";
import { gridStyles } from "./gridStyle";
import React from "react";
import { BellIcon } from "@chakra-ui/icons";

interface GridRowProps extends SimpleGridProps {
  items: any[];
  Icon?: JSX.Element;
  iconBoxBg?: string;
}

function GridRow(props: GridRowProps) {
  const { items, Icon, iconBoxBg } = props;
  const IconClone = React.cloneElement<IconProps>(Icon || <BellIcon />, {
    color: "white",
    boxSize: ".9rem",
  });
  return (
    <SimpleGrid
      gridTemplateColumns={`repeat(${items.length}, 1fr)`}
      sx={gridStyles.row}
      {...props}
    >
      {items.map((item) => (
        <GridItem key={items.indexOf(item)}>
          <Text>{item}</Text>
        </GridItem>
      ))}
      <Center sx={gridStyles.icon} bgColor={iconBoxBg}>
        {IconClone}
      </Center>
    </SimpleGrid>
  );
}

export default GridRow;
