import type { FC, PropsWithChildren } from "react";

import {
  FilterDropdown,
  getDefaultSortOrder,
  List,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import { SearchOutlined } from "@ant-design/icons";
import { Form, Grid, Input, Space, Spin, Table } from "antd";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

import {
  ListTitleButton,
  PaginationTotal,
  Text,
} from "@/dashboard/components";
import type { FileStatus } from "@/dashboard/graphql/schema.types";
import type { FilesTableQuery } from "@/dashboard/graphql/types";
import { useCompaniesSelect } from "@/dashboard/hooks/useCompaniesSelect";
import { useUsersSelect } from "@/dashboard/hooks/useUsersSelect";

import { QUOTES_TABLE_QUERY } from "./queries";

type File = GetFieldsFromList<FilesTableQuery>;

const statusOptions: { label: string; value: FileStatus }[] = [
  {
    label: "Draft",
    value: "DRAFT",
  },
  {
    label: "Sent",
    value: "SENT",
  },
  {
    label: "Accepted",
    value: "ACCEPTED",
  },
];

export const FilesListPage: FC<PropsWithChildren> = ({ children }) => {
  const screens = Grid.useBreakpoint();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQuery: tableQueryResult,
  } = useTable<File>({
    resource: "files",
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    filters: {
      initial: [
        {
          field: "name",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    meta: {
      gqlQuery: QUOTES_TABLE_QUERY,
    },
  });

  const { selectProps: selectPropsCompanies } = useCompaniesSelect();

  const { selectProps: selectPropsUsers } = useUsersSelect();
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
              <Form
                {...searchFormProps}
                initialValues={{
                  name: getDefaultFilter("name", filters, "contains"),
                }}
                layout="inline"
              >
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
            </Space>
          );
        }}
        contentProps={{
          style: {
            marginTop: "28px",
          },
        }}
        title={<ListTitleButton buttonText="Add file" toPath="files" />}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => (
              <PaginationTotal total={total} entityName="files" />
            ),
          }}
          rowKey="id"
        >
          <Table.Column
            dataIndex="title"
            title="Title"
            defaultFilteredValue={getDefaultFilter("title", filters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Name" />
              </FilterDropdown>
            )}
          />
          <Table.Column<File>
            dataIndex={"createdAt"}
            title="Created at"
            sorter
            defaultSortOrder={getDefaultSortOrder("createdAt", sorters)}
            render={(value) => {
              return <Text>{dayjs(value).fromNow()}</Text>;
            }}
          />
          {/* <Table.Column<File>
            fixed="right"
            title="Actions"
            dataIndex="actions"
            render={(_, record) => {
              return (
                <Space>
                  <ShowButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    style={{
                      backgroundColor: "transparent",
                    }}
                  />
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    style={{
                      backgroundColor: "transparent",
                    }}
                  />
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    style={{
                      backgroundColor: "transparent",
                    }}
                  />
                </Space>
              );
            }}
          /> */}
        </Table>
      </List>
      {children}
    </div>
  );
};
