import { useState } from "react";

import { DateField, NumberField, Show } from "@refinedev/antd";

import { FilePdfOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Flex,
  Modal,
  Skeleton,
  Table,
  Typography,
} from "antd";

import { Transaction } from "@/dashboard/lib";

import { useStyles } from "./transaction-preview-modal.styled";

type TransactionPreviewModalProps = {
  isVisible: boolean;
  transaction: Transaction;
  onClose: () => void;
};

export const TransactionPreviewModal: React.FC<
  TransactionPreviewModalProps
> = ({ isVisible, transaction, onClose }) => {
  const { styles } = useStyles();
  const [loading, setLoading] = useState(false);

  return (
    <Modal open={isVisible} onCancel={onClose} footer={null} width="80%">
      <Show
        headerProps={{ style: { padding: 16 } }}
        title="Transactions"
        headerButtons={() => (
          <>
            <Button
              disabled={!transaction}
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<FilePdfOutlined />}
              onClick={() => window.print()}
            >
              Export PDF
            </Button>
          </>
        )}
        contentProps={{
          styles: {
            body: {
              padding: 0,
            },
          },
          style: {
            background: "transparent",
          },
        }}
      >
        <div id="transaction-pdf" className={styles.container}>
          <Card
            bordered={false}
            title={
              <Typography.Text
                style={{
                  fontWeight: 400,
                }}
              >
                {loading ? (
                  <Skeleton.Button style={{ width: 100, height: 22 }} />
                ) : (
                  `Transaction ID #${transaction?.id}`
                )}
              </Typography.Text>
            }
            extra={
              <Flex gap={8} align="center">
                {loading ? (
                  <Skeleton.Button style={{ width: 140, height: 22 }} />
                ) : (
                  <>
                    <Typography.Text>Date:</Typography.Text>
                    <DateField
                      style={{ width: 84 }}
                      value={transaction?.date}
                      format="D MMM YYYY"
                    />
                  </>
                )}
              </Flex>
            }
          >
            <Flex vertical gap={24} className={styles.productServiceContainer}>
              <Typography.Title
                level={4}
                style={{
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Items
              </Typography.Title>
              <Table
                dataSource={transaction?.transactions || [transaction]}
                rowKey={"id"}
                pagination={false}
                loading={loading}
                scroll={{ x: 960 }}
              >
                <Table.Column title="Title" dataIndex="title" key="title" />
                <Table.Column
                  title="Unit Price"
                  dataIndex="unitPrice"
                  key="unitPrice"
                  render={(unitPrice: number) => (
                    <NumberField
                      value={unitPrice}
                      options={{ style: "currency", currency: "USD" }}
                    />
                  )}
                />
                <Table.Column
                  title="Quantity"
                  dataIndex="quantity"
                  key="quantity"
                />
                <Table.Column
                  title="Discount"
                  dataIndex="discount"
                  key="discount"
                  render={(discount: number) => (
                    <Typography.Text>{`${discount}%`}</Typography.Text>
                  )}
                />

                <Table.Column
                  title="Total Price"
                  dataIndex="total"
                  key="total"
                  align="right"
                  width={128}
                  render={(_, record: Transaction) => {
                    return (
                      <NumberField
                        value={record.total}
                        options={{ style: "currency", currency: "USD" }}
                      />
                    );
                  }}
                />
              </Table>
              <Flex
                gap={16}
                vertical
                style={{
                  marginLeft: "auto",
                  marginTop: "24px",
                  width: "200px",
                }}
              >
                <Flex
                  justify="space-between"
                  style={{
                    paddingLeft: 32,
                  }}
                >
                  <Typography.Text className={styles.labelTotal}>
                    Subtotal:
                  </Typography.Text>
                  <NumberField
                    value={transaction?.subTotal || 0}
                    options={{ style: "currency", currency: "USD" }}
                  />
                </Flex>
                <Flex
                  justify="space-between"
                  style={{
                    paddingLeft: 32,
                  }}
                >
                  <Typography.Text className={styles.labelTotal}>
                    Sales tax:
                  </Typography.Text>
                  <Typography.Text>{transaction?.tax || 0}%</Typography.Text>
                </Flex>
                <Divider
                  style={{
                    margin: "0",
                  }}
                />
                <Flex
                  justify="space-between"
                  style={{
                    paddingLeft: 16,
                  }}
                >
                  <Typography.Text
                    className={styles.labelTotal}
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    Total value:
                  </Typography.Text>
                  <NumberField
                    value={transaction?.total || 0}
                    options={{ style: "currency", currency: "USD" }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </div>
      </Show>
    </Modal>
  );
};
