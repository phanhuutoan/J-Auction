import { GridItem, SimpleGrid, SimpleGridProps, Text } from "@chakra-ui/react";
import { gridStyles } from "./gridStyle";

interface GridRowProps extends SimpleGridProps {
  items: any[];
}

function GridRow(props: GridRowProps) {
  const { items } = props;
  return (
    <SimpleGrid
      gridTemplateColumns={`repeat(${items.length}, 1fr)`}
      sx={gridStyles.row}
      {...props}
    >
      {items.map((item) => (
        <GridItem key={item}>
          <Text>{item}</Text>
        </GridItem>
      ))}
    </SimpleGrid>
  );
}

export default GridRow;
