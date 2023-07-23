import {
  Divider,
  GridItem,
  SimpleGrid,
  SimpleGridProps,
  Text,
} from "@chakra-ui/react";
import { Fragment } from "react";

interface GridHeaderProps extends SimpleGridProps {
  items: string[];
}

function GridHeader(props: GridHeaderProps) {
  const { items, ...rest } = props;
  return (
    <Fragment>
      <SimpleGrid
        gridTemplateColumns={`repeat(${items.length}, 1fr)`}
        p="1.5rem"
        {...rest}
      >
        {items.map((item) => (
          <GridItem key={item}>
            <Text fontWeight={500}>{item}</Text>
          </GridItem>
        ))}
      </SimpleGrid>
      <Divider borderColor={"blue.200"} mb="1rem" />
    </Fragment>
  );
}

export default GridHeader;
