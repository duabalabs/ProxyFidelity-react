import { type FC, type PropsWithChildren, useState } from "react";

import { List, useTable } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";

import {
  AppstoreOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Form, Grid, Input, Radio, Space, Spin } from "antd";
import debounce from "lodash/debounce";

import { ListTitleButton } from "@/dashboard/components";
import { User, USER_CLASSNAME } from "@/dashboard/lib";

import { PeopleCardView } from "./components";

type View = "card" | "table";

export const PeopleListPage: FC<PropsWithChildren> = ({ children }) => {
  const [view, setView] = useState<View>("card");
  const screens = Grid.useBreakpoint();

  const {
    tableProps,
    tableQuery: tableQueryResult,
    searchFormProps,
    filters,
    sorters,
    setCurrent,
    setPageSize,
    setFilters,
  } = useTable<User, HttpError, { name: string }>({
    resource: USER_CLASSNAME,
    queryOptions: {
      cacheTime: 0,
    },
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
      ],
    },
    pagination: {
      pageSize: 12,
      filterWithIncludes: ["role"],
    } as any,
    // meta: {
    //   gqlQuery: COMPANIES_TABLE_QUERY,
    // },
  });

  const onViewChange = (value: View) => {
    setView(value);
    setFilters([], "replace");
    // TODO: useForm should handle this automatically. remove this when its fixed from antd useForm.
    searchFormProps.form?.resetFields();
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      name: e.target.value ?? "",
    });
  };
  const debouncedOnChange = debounce(onSearch, 500);

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        headerButtons={() => {
          return (
            <Space
              style={{
                marginTop: screens.xs ? "1.6rem" : undefined,
              }}
            >
              <Form {...searchFormProps} layout="inline">
                <Form.Item name="name" noStyle>
                  <Input
                    size="large"
                    // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    prefix={<SearchOutlined className="anticon tertiary" />}
                    suffix={
                      <Spin
                        size="small"
                        spinning={tableQueryResult.isFetching}
                      />
                    }
                    placeholder="Search by name"
                    onChange={debouncedOnChange}
                  />
                </Form.Item>
              </Form>
              {!screens.xs ? (
                <Radio.Group
                  size="large"
                  value={view}
                  onChange={(e) => onViewChange(e.target.value)}
                >
                  <Radio.Button value="table">
                    {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                    <UnorderedListOutlined />
                  </Radio.Button>
                  <Radio.Button value="card">
                    {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                    <AppstoreOutlined />
                  </Radio.Button>
                </Radio.Group>
              ) : null}
            </Space>
          );
        }}
        contentProps={{
          style: {
            marginTop: "28px",
          },
        }}
        title={<ListTitleButton toPath="people" buttonText="Add new people" />}
      >
        {/* <PeopleTableView
            tableProps={tableProps}
            filters={filters}
            sorters={sorters}
          /> */}
        <PeopleCardView
          tableProps={tableProps}
          setPageSize={setPageSize}
          setCurrent={setCurrent}
        />
      </List>
      {children}
    </div>
  );
};
