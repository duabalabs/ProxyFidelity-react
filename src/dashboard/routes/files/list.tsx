import type { FC, PropsWithChildren } from "react";
import { useState } from "react";

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

import { ListTitleButton, PaginationTotal, Text } from "@/dashboard/components";
import { FilePreviewModal } from "@/dashboard/components/file-preview";
import type { FilesTableQuery } from "@/dashboard/graphql/types";

import { QUOTES_TABLE_QUERY } from "./queries";

type File = GetFieldsFromList<FilesTableQuery>; //NOTE change to Parse subclass

export const FilesListPage: FC<PropsWithChildren> = ({ children }) => {
  const screens = Grid.useBreakpoint();
  const [file, setFile] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
          value: (values as any).name,
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

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      name: e.target.value ?? "",
    });
  };

  const debouncedOnChange = debounce(onSearch, 500);

  const handleRowClick = (record) => {
    if (record?.file) {
      setFile(record);
      setIsModalVisible(true);
    } else {
      console.error("File not found in the record.");
    }
  };

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
                    prefix={
                      <SearchOutlined
                        className="anticon tertiary"
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
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
          onRow={(record) => {
            return {
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" }, // Set cursor to pointer for clickable rows
            };
          }}
        >
          <Table.Column
            dataIndex="name"
            title="Name"
            defaultFilteredValue={getDefaultFilter("name", filters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Name" />
              </FilterDropdown>
            )}
          />
          <Table.Column<File>
            dataIndex={"createdAt"}
            title="Created at"
            // sorter
            defaultSortOrder={getDefaultSortOrder("createdAt", sorters)}
            render={(value) => {
              return <Text>{dayjs(value).fromNow()}</Text>;
            }}
          />
        </Table>
      </List>
      {children}

      {file && (
        <FilePreviewModal
          isVisible={isModalVisible}
          file={file}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};
