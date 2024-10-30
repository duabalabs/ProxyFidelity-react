import { type FC, useEffect, useMemo, useState } from "react";

import { List, type ListProps, type TableProps } from "antd";

import { PaginationTotal } from "@/dashboard/components";
import { User } from "@/dashboard/lib";

import { PeopleCard, PeopleCardSkeleton } from "./card";

type Props = {
  tableProps: TableProps<User>;
  setCurrent: (current: number) => void;
  setPageSize: (pageSize: number) => void;
};

export const PeopleCardView: FC<Props> = ({
  tableProps: { dataSource, pagination, loading },
  setCurrent,
  setPageSize,
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!dataSource) return;
    const fetchUserRole = async () => {
      const data = await Promise.all(
        dataSource?.map(async (user) => {
          await user.fetchWithInclude("role");
          return user;
        })
      );
      setData(data);
    };
    fetchUserRole();
  }, [dataSource]);

  return (
    <List
      grid={{
        gutter: 32,
        column: 4,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 4,
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <PeopleCard people={item} />
        </List.Item>
      )}
      pagination={{
        ...(pagination as ListProps<User>["pagination"]),
        hideOnSinglePage: true,
        itemRender: undefined,
        position: "bottom",
        style: { display: "flex", marginTop: "1rem" },
        pageSizeOptions: ["12", "24", "48"],
        onChange: (page, pageSize) => {
          setCurrent(page);
          setPageSize(pageSize);
        },
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="people" />
        ),
      }}
    >
      {loading ? (
        <List
          grid={{
            gutter: 32,
            column: 4,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 4,
          }}
          dataSource={Array.from({ length: 12 }).map((_, i) => ({
            id: i,
          }))}
          renderItem={() => (
            <List.Item>
              <PeopleCardSkeleton />
            </List.Item>
          )}
        />
      ) : undefined}
    </List>
  );
};
