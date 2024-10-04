import { type FC, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { FilterDropdown, ShowButton, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  ContainerOutlined,
  ExportOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Space, Table } from "antd";

import { Participants, FileStatusTag, Text } from "@/dashboard/components";
import type { FileStatus } from "@/dashboard/graphql/schema.types";
import type { CompanyFilesTableQuery } from "@/dashboard/graphql/types";
import { useUsersSelect } from "@/dashboard/hooks/useUsersSelect";
import { currencyNumber } from "@/utilities";

import { COMPANY_QUOTES_TABLE_QUERY } from "./queries";

type Props = {
  style?: React.CSSProperties;
};

type File = GetFieldsFromList<CompanyFilesTableQuery>;

export const CompanyFilesTable: FC<Props> = ({ style }) => {
  const { listUrl } = useNavigation();
  const params = useParams();

  const { tableProps, filters, setFilters } = useTable<File>({
    resource: "files",
    syncWithLocation: false,
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "title",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],
      permanent: [
        {
          field: "company.id",
          operator: "eq",
          value: params.id,
        },
      ],
    },
    meta: {
      gqlQuery: COMPANY_QUOTES_TABLE_QUERY,
    },
  });

  const { selectProps: selectPropsUsers } = useUsersSelect();

  const showResetFilters = useMemo(() => {
    return filters?.filter((filter) => {
      if ("field" in filter && filter.field === "company.id") {
        return false;
      }

      if (!filter.value) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const hasData = (tableProps?.dataSource?.length || 0) > 0;

  return (
    <Card
      style={style}
      headStyle={{
        borderBottom: "1px solid #D9D9D9",
        marginBottom: "1px",
      }}
      bodyStyle={{ padding: 0 }}
      title={
        <Space size="middle">
          {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
          <ContainerOutlined />
          <Text>Files</Text>

          {showResetFilters?.length > 0 && (
            <Button size="small" onClick={() => setFilters([], "replace")}>
              Reset filters
            </Button>
          )}
        </Space>
      }
    >
      {!hasData && (
        <Space
          direction="vertical"
          size={16}
          style={{
            padding: 16,
          }}
        >
          <Text>No files yet</Text>
          <Link to={listUrl("files")}>
            {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
            <PlusCircleOutlined
              style={{
                marginRight: 4,
              }}
            />{" "}
            Add files
          </Link>
        </Space>
      )}
      {hasData && (
        <Table
          {...tableProps}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: false,
          }}
        >
          <Table.Column
            title="File Title"
            dataIndex="title"
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Title" />
              </FilterDropdown>
            )}
          />
          <Table.Column<File>
            title="Total amount"
            dataIndex="total"
            sorter
            render={(_, record) => {
              return <Text>{currencyNumber(record.total || 0)}</Text>;
            }}
          />
          <Table.Column<File>
            title="Stage"
            dataIndex="status"
            render={(_, record) => {
              if (!record.status) return null;

              return <FileStatusTag status={record.status} />;
            }}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                  options={statusOptions}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<File>
            dataIndex={["salesOwner", "id"]}
            title="Participants"
            render={(_, record) => {
              return (
                <Participants
                  userOne={record.salesOwner}
                  userTwo={record.contact}
                />
              );
            }}
            filterDropdown={(props) => {
              return (
                <FilterDropdown {...props}>
                  <Select
                    style={{ width: "200px" }}
                    placeholder="Select Sales Owner"
                    {...selectPropsUsers}
                  />
                </FilterDropdown>
              );
            }}
          />
          <Table.Column<File>
            dataIndex="id"
            width={48}
            render={(value) => {
              return (
                <ShowButton
                  recordItemId={value}
                  hideText
                  size="small"
                  resource="contacts"
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon={<ExportOutlined />}
                />
              );
            }}
          />
        </Table>
      )}{" "}
    </Card>
  );
};

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
