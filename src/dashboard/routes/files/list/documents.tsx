import type { FC, PropsWithChildren } from "react";

import { FilterDropdown, getDefaultSortOrder, List } from "@refinedev/antd";
import { getDefaultFilter } from "@refinedev/core";

import { SearchOutlined } from "@ant-design/icons";
import { Form, Input, Space, Spin, Table } from "antd";
import dayjs from "dayjs";

import { ListTitleButton, PaginationTotal, Text } from "@/dashboard/components";
import { PROJECTFILE_CLASSNAME } from "@/dashboard/lib/parse";
import { FilePreviewModal } from "@/dashboard/routes/files/components/file-preview-modal";

import { useDocumentListActions } from "./actions";

export const DocumentListPage: FC<PropsWithChildren> = ({ children }) => {
  const {
    screens,
    file,
    isModalVisible,
    setIsModalVisible,
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQueryResult,
    debouncedOnChange,
    handleRowClick,
  } = useDocumentListActions();

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
                  name: getDefaultFilter("nam", filters, "contains"),
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
        title={<ListTitleButton buttonText="Add Documents" toPath="documents" />}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => (
              <PaginationTotal
                total={total}
                entityName={PROJECTFILE_CLASSNAME}
              />
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
            dataIndex="fileName"
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
