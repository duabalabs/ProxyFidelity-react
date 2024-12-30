import { FC, PropsWithChildren, useMemo, useState } from "react";

import { List, useTable } from "@refinedev/antd";

import {
  Button,
  Card,
  DatePicker,
  Input,
  Modal,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";

import { ListTitleButton, PaginationTotal } from "@/components";
import { useAppData } from "@/context";
import { Transaction, TRANSACTION_CLASSNAME } from "@/lib";

import { TransactionPreviewModal } from "./components/transaction-preview-modal";

export const TransactionListPage: FC<PropsWithChildren> = ({ children }) => {
  const { activeProject, user } = useAppData();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({}); // Stores filters for all columns
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(
    null
  );
  const [filterInputValue, setFilterInputValue] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { tableProps } = useTable<Transaction>({
    resource: TRANSACTION_CLASSNAME,
    initialSorter: [{ field: "date", order: "desc" }],
    filters: {
      permanent: [{ field: "project", value: activeProject, operator: "eq" }],
    },
    pagination: { pageSize: 50 },
  });

  // Filter and sorting logic
  const filteredDataSource = useMemo(() => {
    let data = tableProps.dataSource || [];
    Object.entries(filters).forEach(([key, value]: [string, any]) => {
      if (value) {
        if (key === "date") {
          // Date range filtering
          data = data.filter((item) => {
            const itemDate = dayjs(item.date);
            const startDate = value.startDate ? dayjs(value.startDate) : null;
            const endDate = value.endDate ? dayjs(value.endDate) : null;

            // Skip invalid dates
            if (!itemDate.isValid()) {
              return false;
            }

            // Apply date range filter
            return (
              (!startDate || itemDate.isAfter(startDate.subtract(1, "day"))) &&
              (!endDate || itemDate.isBefore(endDate.add(1, "day")))
            );
          });
        } else if (key === "total") {
          // Numeric range filtering
          data = data.filter((item) => {
            return (
              (!value.min || item.total >= value.min) &&
              (!value.max || item.total <= value.max)
            );
          });
        } else {
          // Text or categorical filtering
          data = data.filter((item) =>
            item[key]?.toString().toLowerCase().includes(value.toLowerCase())
          );
        }
      }
    });
    return data;
  }, [filters, tableProps.dataSource]);

  const handleFilterApply = (columnKey: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnKey]: filterInputValue,
    }));
    handleFilterModalClose();
  };

  const handleFilterModalClose = () => {
    setActiveFilterColumn(null);
    setFilterInputValue(undefined);
    setIsModalVisible(false);
  };

  const openFilterModal = (columnKey: string) => {
    setActiveFilterColumn(columnKey);
    setFilterInputValue(filters[columnKey] || {});
    setIsModalVisible(true);
  };

  const resetFilter = (key: string) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[key];
      return newFilters;
    });
  };

  const renderFilterInput = (columnKey: string) => {
    if (columnKey === "date") {
      return (
        <DatePicker.RangePicker
          value={[
            filterInputValue?.startDate
              ? dayjs(filterInputValue.startDate)
              : null,
            filterInputValue?.endDate ? dayjs(filterInputValue.endDate) : null,
          ]}
          onChange={(dates) => {
            setFilterInputValue({
              ...filterInputValue,
              startDate: dates ? dates[0] : null,
              endDate: dates ? dates[1] : null,
            });
          }}
        />
      );
    }

    if (columnKey === "total") {
      return (
        <Space>
          <Input
            placeholder="Min"
            type="number"
            value={filterInputValue?.min || ""}
            onChange={(e) =>
              setFilterInputValue({
                ...filterInputValue,
                min: Number(e.target.value),
              })
            }
          />
          <Input
            placeholder="Max"
            type="number"
            value={filterInputValue?.max || ""}
            onChange={(e) =>
              setFilterInputValue({
                ...filterInputValue,
                max: Number(e.target.value),
              })
            }
          />
        </Space>
      );
    }

    if (columnKey === "vendor" || columnKey === "title") {
      return (
        <Select
          mode="multiple"
          placeholder={`Select ${columnKey}`}
          value={filterInputValue || []}
          onChange={(value) => setFilterInputValue(value)}
          options={[
            ...new Set(
              tableProps.dataSource?.map((item) => item[columnKey]) || []
            ),
          ].map((value) => ({ value, label: value }))}
        />
      );
    }

    return (
      <Input
        placeholder={`Enter ${columnKey}`}
        value={filterInputValue || ""}
        onChange={(e) => setFilterInputValue(e.target.value)}
      />
    );
  };

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        title={
          <ListTitleButton buttonText="Add Transaction" toPath="transaction" />
        }
      >
        <div style={{ marginBottom: "16px" }}>
          {Object.keys(filters).length > 0 ? (
            <Space wrap>
              {(Object.entries(filters) as any).map(([key, value]) => (
                <Tag
                  key={key}
                  closable
                  onClose={() => resetFilter(key)}
                  style={{ padding: "5px 10px", borderRadius: "16px" }}
                >
                  {key === "date"
                    ? `Date: ${value.startDate || "N/A"} - ${
                        value.endDate || "N/A"
                      }`
                    : key === "total"
                    ? `Total: ${value.min || "Min"} - ${value.max || "Max"}`
                    : `${key}: ${value}`}
                </Tag>
              ))}
            </Space>
          ) : (
            <Typography.Text>No filters applied</Typography.Text>
          )}
        </div>
        <Table
          {...tableProps}
          dataSource={filteredDataSource}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => (
              <PaginationTotal
                total={total}
                entityName={TRANSACTION_CLASSNAME}
              />
            ),
          }}
          rowKey="id"
        >
          <Table.Column
            title={
              <span onClick={() => openFilterModal("date")}>
                Date <Button type="link">🔽</Button>
              </span>
            }
            dataIndex="date"
            key="date"
            render={(date) => new Date(date).toLocaleDateString()}
          />
          <Table.Column
            title={
              <span onClick={() => openFilterModal("title")}>
                Title <Button type="link">🔽</Button>
              </span>
            }
            dataIndex="title"
            key="title"
          />
          <Table.Column
            title={
              <span onClick={() => openFilterModal("vendor")}>
                Vendor <Button type="link">🔽</Button>
              </span>
            }
            dataIndex="vendor"
            key="vendor"
          />
          <Table.Column
            title={
              <span onClick={() => openFilterModal("total")}>
                Total <Button type="link">🔽</Button>
              </span>
            }
            dataIndex="total"
            key="total"
            render={(total, record) => (
              <Typography.Text
                style={{ color: record.deposit ? "green" : "red" }}
              >
                {record.deposit
                  ? `+${total.toFixed(2)}`
                  : `-${Math.abs(total).toFixed(2)}`}
              </Typography.Text>
            )}
          />
        </Table>
      </List>

      {/* Filter Modal */}
      <Modal
        title={`Filter by ${activeFilterColumn}`}
        visible={isModalVisible}
        onCancel={handleFilterModalClose}
        onOk={() => handleFilterApply(activeFilterColumn!)}
        okText="Apply Filter"
      >
        {renderFilterInput(activeFilterColumn!)}
      </Modal>

      {children}

      {transaction && (
        <TransactionPreviewModal
          isVisible={isModalVisible}
          transaction={transaction}
          onClose={() => setTransaction(null)}
        />
      )}
    </div>
  );
};
