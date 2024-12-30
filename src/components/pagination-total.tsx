import type { FC } from "react";

import { Text } from "@/components";

type PaginationTotalProps = {
  total: number;
  entityName: string;
};

export const PaginationTotal: FC<PaginationTotalProps> = ({
  total,
  entityName,
}) => {
  return (
    <Text style={{ marginLeft: "16px" }}>
      {`${total} ${entityName} in total`}
    </Text>
  );
};
