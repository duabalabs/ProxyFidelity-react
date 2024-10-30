import { FC, PropsWithChildren, useState } from "react";

import { List, useTable } from "@refinedev/antd";

import PaystackPop from "@paystack/inline-js";
import { Button, Grid, message, Space, Table, Typography } from "antd";

import { ListTitleButton, PaginationTotal } from "@/dashboard/components";
import { useAppData } from "@/dashboard/context";
import { Transaction, TRANSACTION_CLASSNAME } from "@/dashboard/lib";

import { TransactionPreviewModal } from "./components/transaction-preview-modal";

export const TransactionListPage: FC<PropsWithChildren> = ({ children }) => {
  const { activeProject, user } = useAppData(); // Fetch activeProject and user
  const screens = Grid.useBreakpoint();
  const [transaction, setTransaction] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]); // Track selected transactions
  const { tableProps } = useTable<Transaction>({
    resource: TRANSACTION_CLASSNAME,
    queryOptions: {
      cacheTime: 0,
    },
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

  const handleSelectTransaction = (record, selected) => {
    if (selected) {
      setSelectedTransactions([...selectedTransactions, record]);
    } else {
      setSelectedTransactions(
        selectedTransactions.filter((item) => item.id !== record.id)
      );
    }
  };

  const approveSelected = async () => {
    try {
      const transactionIds = selectedTransactions.map(
        (transaction) => transaction.id
      );
      await Parse.Cloud.run("approveTransaction", {
        transactionId: transactionIds,
      });
      message.success("Selected transactions approved!");
    } catch (error) {
      message.error("Error during batch approval.");
    }
  };

  const paySelected = async () => {
    const totalAmount = selectedTransactions.reduce(
      (sum, transaction) => sum + transaction.unitPrice,
      0
    );

    const handler = PaystackPop.setup({
      key: "your-paystack-public-key",
      email: user.get("email"),
      amount: totalAmount,
      callback: async (response) => {
        try {
          await Promise.all(
            selectedTransactions.map(async (transaction) => {
              await Parse.Cloud.run("markAsPaid", {
                transactionId: transaction.id,
                reference: response.reference,
              });
            })
          );
          message.success("Payment successful for selected transactions!");
        } catch (error) {
          message.error("Error marking transactions as paid.");
        }
      },
    });
    handler.openIframe();
  };

  if (!user || !activeProject) {
    return null;
  }
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
          rowSelection={{
            type: "checkbox",
            onSelect: handleSelectTransaction, // Added row selection for batch actions
            getCheckboxProps: (record) => ({
              disabled: user.isClient && record.approved, // Example: Disable checkbox for clients if already approved
            }),
          }}
          onRow={(record) => {
            return {
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            };
          }}
          dataSource={parentTransactions}
        >
          {/* Original columns */}
          <Table.Column
            title="Title"
            dataIndex="title"
            key="title"
            render={(text, record) => (
              <Typography.Text>
                {text || record.vendor || `${record?.children?.[0]?.title}...`}
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

          {/* New Approval Column */}
          {user.isAdmin ? ( // Only show to Admins and Clients
            <Table.Column
              title="Approval"
              dataIndex="approved"
              key="approved"
              render={(approved) => (
                <Typography.Text type={approved ? "success" : "warning"}>
                  {approved ? "Approved" : "Pending"}
                </Typography.Text>
              )}
            />
          ) : null}

          {/* New Payment Column */}
          {user.isAdmin || user.isClient ? ( // Only show to Admins and Clients
            <Table.Column
              title="Payment"
              dataIndex="paid"
              key="paid"
              render={(paid) => (
                <Typography.Text type={paid ? "success" : "danger"}>
                  {paid ? "Paid" : "Not Paid"}
                </Typography.Text>
              )}
            />
          ) : null}
        </Table>
      </List>

      {/* Batch Action Buttons */}
      {user.isAdmin || user.isClient ? ( // Only show batch actions to Admins or Clients
        <Space>
          {user.isAdmin && (
            <Button
              onClick={approveSelected}
              disabled={selectedTransactions.length === 0}
            >
              Approve Selected
            </Button>
          )}
          <Button
            type="primary"
            onClick={paySelected}
            disabled={selectedTransactions.length === 0}
          >
            Pay Selected
          </Button>
        </Space>
      ) : null}

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
