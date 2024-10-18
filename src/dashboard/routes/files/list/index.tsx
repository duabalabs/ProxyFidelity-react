import type { FC, PropsWithChildren } from "react";
import { useState } from "react";

import {
  FilterDropdown,
  getDefaultSortOrder,
  List,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter } from "@refinedev/core";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Grid, Input, Space, Spin, Table } from "antd";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

import { ListTitleButton, PaginationTotal, Text } from "@/dashboard/components";
import { FilePreviewModal } from "@/dashboard/components/file-preview";
import { useAppData } from "@/dashboard/context/app-data";
import { ProjectFile } from "@/dashboard/lib/parse";

export const FilesListPage: FC<PropsWithChildren> = ({ children }) => {
  const screens = Grid.useBreakpoint();
  const [file, setFile] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { activeProject } = useAppData();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQuery: tableQueryResult,
  } = useTable<ProjectFile>({
    resource: "ProjectFile",
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
      permanent: [
        {
          field: "project",
          value: activeProject,
          operator: "eq",
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
  });

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      name: e.target.value ?? "",
    });
  };

  const debouncedOnChange = debounce(onSearch, 500);

  const handleRowClick = (record) => {
    if (record?.cdnUrl || record?.originalUrl) {
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
            defaultSortOrder={getDefaultSortOrder("createdAt", sorters)}
            render={(value) => {
              return <Text>{dayjs(value).fromNow()}</Text>;
            }}
          />
        </Table>
      </List>
      {children}

      {/* Modal for File Preview */}
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
