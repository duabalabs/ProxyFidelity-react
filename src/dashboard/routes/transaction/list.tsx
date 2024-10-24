import { FC, PropsWithChildren, useState } from "react";

import { List, useTable } from "@refinedev/antd";

import { Grid, Space, Table, Typography } from "antd";

import { ListTitleButton, PaginationTotal } from "@/dashboard/components";
import { useAppData } from "@/dashboard/context";
import { Transaction, TRANSACTION_CLASSNAME } from "@/dashboard/lib";

import { TransactionPreviewModal } from "./components/transaction-preview-modal";

export const TransactionListPage: FC<PropsWithChildren> = ({ children }) => {
  const { activeProject } = useAppData();
  const screens = Grid.useBreakpoint();
  const [transaction, setTransaction] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { tableProps } = useTable<Transaction>({
    resource: TRANSACTION_CLASSNAME,
    initialSorter: [
      {
        field: "date",
        order: "desc",
      },
    ],
    filters: {
      permanent: [
        {
          field: "project",
          value: activeProject,
          operator: "eq",
        },
      ],
    },
  });

  const parentTransactions = tableProps.dataSource?.filter(
    (transaction) => transaction.isParent
  );

  const processedData = parentTransactions?.map((transaction) => {
    if (transaction.transactions?.length) {
      return {
        ...transaction,
        children: transaction.transactions.map((subTransaction) => ({
          ...subTransaction,
        })),
      };
    }
    return transaction;
  });

  const handleRowClick = (record) => {
    if (record) {
      setTransaction(record);
      setIsModalVisible(true);
    } else {
      console.error("Transaction not found in the record.");
    }
  };

  const formatNumberColumn = (value: number, negative = false) => {
    return `${negative ? "-" : ""}$${(value ?? 0).toFixed(2)}`;
  };

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        contentProps={{
          style: {
            marginTop: "28px",
          },
        }}
        headerButtons={() => {
          return (
            <Space
              style={{
                marginTop: screens.xs ? "1.6rem" : undefined,
              }}
            ></Space>
          );
        }}
        title={
          <ListTitleButton buttonText="Add Transaction" toPath="transaction" />
        }
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => (
              <PaginationTotal
                total={total}
                entityName={TRANSACTION_CLASSNAME}
              />
            ),
          }}
          expandable={{ defaultExpandAllRows: true }}
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            };
          }}
          dataSource={processedData as any}
        >
          <Table.Column
            title="Title"
            dataIndex="title"
            key="title"
            render={(text, record) => (
              <Typography.Text>
                {text || record.vendor || `${record.children[0].title}...`}
              </Typography.Text>
            )}
          />
          <Table.Column
            title="Vendor"
            dataIndex="vendor"
            key="vendor"
            render={(vendor, record) =>
              record.isParent ? (
                <Typography.Text>{vendor}</Typography.Text>
              ) : (
                <Typography.Text>-</Typography.Text>
              )
            }
          />
          <Table.Column
            title="Unit Price"
            dataIndex="unitPrice"
            key="unitPrice"
            render={(unitPrice, record) =>
              record.children ? (
                <Typography.Text>-</Typography.Text>
              ) : (
                <Typography.Text>
                  {formatNumberColumn(unitPrice)}
                </Typography.Text>
              )
            }
          />
          <Table.Column
            title="Quantity"
            dataIndex="quantity"
            key="quantity"
            render={(quantity, record) =>
              record.children ? (
                <Typography.Text>-</Typography.Text>
              ) : (
                <Typography.Text>{quantity}</Typography.Text>
              )
            }
          />
          <Table.Column
            title="Discount"
            dataIndex="discount"
            key="discount"
            render={(discount, record) =>
              record.isParent ? (
                <Typography.Text>
                  {formatNumberColumn(discount)}
                </Typography.Text>
              ) : (
                <Typography.Text>-</Typography.Text>
              )
            }
          />
          <Table.Column
            title="Tax"
            dataIndex="tax"
            key="tax"
            render={(tax, record) =>
              record.isParent ? (
                <Typography.Text>{formatNumberColumn(tax)}</Typography.Text>
              ) : (
                <Typography.Text>-</Typography.Text>
              )
            }
          />
          <Table.Column
            title="Shipping"
            dataIndex="shipping"
            key="shipping"
            render={(shipping, record) =>
              record.isParent ? (
                <Typography.Text>
                  {formatNumberColumn(shipping)}
                </Typography.Text>
              ) : (
                <Typography.Text>-</Typography.Text>
              )
            }
          />
          <Table.Column
            title="Subtotal"
            dataIndex="subTotal"
            key="subTotal"
            render={(subTotal, record) =>
              record.isParent ? (
                <Typography.Text>
                  {formatNumberColumn(subTotal)}
                </Typography.Text>
              ) : (
                <Typography.Text>-</Typography.Text>
              )
            }
          />
          <Table.Column
            title="Total"
            dataIndex="total"
            key="total"
            render={(total) => (
              <Typography.Text>{formatNumberColumn(total)}</Typography.Text>
            )}
          />
          <Table.Column
            title="Date"
            dataIndex="date"
            key="date"
            render={(date, record) =>
              record.isParent ? (
                <Typography.Text>
                  {new Date(date).toLocaleDateString()}
                </Typography.Text>
              ) : (
                <Typography.Text>-</Typography.Text>
              )
            }
          />
        </Table>
      </List>
      {children}

      {transaction && (
        <TransactionPreviewModal
          isVisible={isModalVisible}
          transaction={transaction}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};
