import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import { NumberField, useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Spin,
  Typography,
} from "antd";

import { useAppData } from "@/context";
import { ITransaction, Transaction, TRANSACTION_CLASSNAME } from "@/lib";

import { useStyles } from "./transaction-form-modal.styled";

export const TransactionFormModal = ({
  action,
  redirect,
  onCancel,
  onMutationSuccess,
}: any) => {
  const params = useParams<{ id: string }>();
  const { list } = useNavigation();
  const { activeProject } = useAppData();
  const [loading, setLoading] = useState(false);

  const { formProps, modalProps, close, onFinish } = useModalForm({
    resource: TRANSACTION_CLASSNAME,
    action,
    id: params.id,
    defaultVisible: true,
    redirect,
    warnWhenUnsavedChanges: false,
  });
  const form = formProps.form;

  const [tax, setTax] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  const [transactions, setTransactions] = useState([
    {
      title: "",
      unitPrice: 0,
      quantity: 1,
      discount: 0,
      total: 0,
    } as any,
  ]);
  const [groupTitle, setGroupTitle] = useState<string>();
  const subTotal = transactions.reduce(
    (acc, transaction) => acc + transaction.unitPrice * transaction.quantity,
    0
  );
  const total = subTotal + tax + shipping - discount;

  const { styles } = useStyles();

  const handleTransactionNumbersChange = (
    index: number,
    key: "quantity" | "discount" | "unitPrice",
    value: number
  ) => {
    setTransactions((prev) => {
      const currentTransaction = { ...prev[index] };
      currentTransaction[key] = value;
      currentTransaction.total =
        currentTransaction.unitPrice *
        currentTransaction.quantity *
        ((100 - currentTransaction.discount) / 100);

      return prev.map((item, i) => (i === index ? currentTransaction : item));
    });
  };

  const onFinishHandler = async (values: Transaction) => {
    try {
      setLoading(true);
      const entryTransaction = new Transaction({
        total,
        subTotal,
        tax,
        discount,
        shipping,
        isParent: true,
        date: new Date().toISOString(),
        project: activeProject,
        title: groupTitle,
      } as any);

      let entryTransactions = [];
      if (transactions.length > 1) {
        entryTransactions = transactions.map((transaction) => {
          const item = new Transaction({
            ...transaction,
            date: new Date().toISOString(),
            project: activeProject,
          } as ITransaction);
          return item;
        });
        entryTransaction.set("children", entryTransactions);
      } else {
        entryTransaction.fromObject(transactions[0]);
      }
      await entryTransaction.save();
      setLoading(false);
      message.success("Transaction added successfully.");
      form.resetFields();
      close();
      list("transaction", "replace");
    } catch (error) {
      console.error(`Error adding transaction`, error);
      message.error("Failed to add the transaction(s).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...modalProps}
      title="Transaction Form"
      onCancel={() => {
        if (onCancel) {
          onCancel();
          return;
        }
        form.resetFields();
        close();
        list("transaction", "replace");
      }}
    >
      <Spin spinning={loading}>
        <Form
          {...formProps}
          onFinish={(values) => onFinishHandler(values as Transaction)}
          layout="vertical"
        >
          <Flex vertical gap={32}>
            <Typography.Title level={3}>New Transaction</Typography.Title>
            <Card
              bordered={false}
              styles={{
                body: {
                  padding: 0,
                },
              }}
            >
              <div style={{ padding: "32px" }}>
                <Typography.Title
                  level={4}
                  style={{ marginBottom: "32px", fontWeight: 400 }}
                >
                  Items
                </Typography.Title>
                <div className={styles.transactionTableWrapper}>
                  <div className={styles.transactionTableContainer}>
                    <Row className={styles.transactionHeader}>
                      <Col
                        xs={{ span: 7 }}
                        className={styles.transactionHeaderColumn}
                      >
                        Title
                        <Divider
                          type="vertical"
                          className={styles.transactionHeaderDivider}
                        />
                      </Col>
                      <Col
                        xs={{ span: 5 }}
                        className={styles.transactionHeaderColumn}
                      >
                        Unit Price
                        <Divider
                          type="vertical"
                          className={styles.transactionHeaderDivider}
                        />
                      </Col>
                      <Col
                        xs={{ span: 4 }}
                        className={styles.transactionHeaderColumn}
                      >
                        Quantity
                        <Divider
                          type="vertical"
                          className={styles.transactionHeaderDivider}
                        />
                      </Col>
                      <Col
                        xs={{ span: 3 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                        className={styles.transactionHeaderColumn}
                      >
                        Total Price
                      </Col>
                      <Col xs={{ span: 1 }}> </Col>
                    </Row>
                    <Row>
                      {transactions.map((transaction, index) => {
                        return (
                          <Fragment key={index}>
                            <Col
                              xs={{ span: 7 }}
                              className={styles.transactionRowColumn}
                            >
                              <Input
                                placeholder="Title"
                                value={transaction.title}
                                onChange={(e) => {
                                  setTransactions((prev) =>
                                    prev.map((item, i) =>
                                      i === index
                                        ? { ...item, title: e.target.value }
                                        : item
                                    )
                                  );
                                }}
                              />
                            </Col>
                            <Col
                              xs={{ span: 5 }}
                              className={styles.transactionRowColumn}
                            >
                              <InputNumber
                                addonAfter="GHS"
                                style={{ width: "100%" }}
                                placeholder="Unit Price"
                                type="number"
                                min={0}
                                value={transaction.unitPrice}
                                onChange={(value) => {
                                  handleTransactionNumbersChange(
                                    index,
                                    "unitPrice",
                                    value || 0
                                  );
                                }}
                              />
                            </Col>
                            <Col
                              xs={{ span: 4 }}
                              className={styles.transactionRowColumn}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Quantity"
                                type="number"
                                min={0}
                                value={transaction.quantity}
                                onChange={(value) => {
                                  handleTransactionNumbersChange(
                                    index,
                                    "quantity",
                                    value || 1
                                  );
                                }}
                              />
                            </Col>

                            <Col
                              xs={{ span: 3 }}
                              className={styles.transactionRowColumn}
                              style={{
                                justifyContent: "flex-end",
                              }}
                            >
                              <NumberField
                                value={transaction.total}
                                options={{ style: "currency", currency: "USD" }}
                              />
                            </Col>
                            <Col
                              xs={{ span: 1 }}
                              className={styles.transactionRowColumn}
                              style={{
                                paddingLeft: "0",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                danger
                                size="small"
                                icon={
                                  <DeleteOutlined
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  />
                                }
                                onClick={() => {
                                  setTransactions((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                }}
                              />
                            </Col>
                          </Fragment>
                        );
                      })}
                    </Row>
                    <Divider
                      style={{
                        margin: "0",
                      }}
                    />
                    <div style={{ padding: "12px" }}>
                      <Button
                        icon={
                          <PlusCircleOutlined
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        }
                        type="text"
                        className={styles.addNewTransactionItemButton}
                        onClick={() => {
                          setTransactions((prev) => [
                            ...prev,
                            {
                              title: "",
                              unitPrice: 0,
                              quantity: 1,
                              discount: 0,
                              total: 0,
                            },
                          ]);
                        }}
                      >
                        Add new item
                      </Button>
                    </div>
                  </div>
                </div>
                <Flex
                  gap={16}
                  vertical
                  style={{
                    marginLeft: "auto",
                    marginTop: "24px",
                    width: "280px",
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
                      style={{
                        width: "100%",
                        textAlign: "right",
                      }}
                      value={subTotal}
                      options={{ style: "currency", currency: "USD" }}
                    />
                  </Flex>
                  {[
                    { label: "Sales tax:", value: tax, setValue: setTax },
                    {
                      label: "Shipping:",
                      value: shipping,
                      setValue: setShipping,
                    },
                    {
                      label: "Discount: ",
                      value: discount,
                      setValue: setDiscount,
                    },
                  ].map((item, index) => (
                    <Flex
                      key={index}
                      align="center"
                      flex={1}
                      justify="space-around"
                      style={{
                        paddingLeft: 32,
                      }}
                    >
                      <Typography.Text className={styles.labelTotal}>
                        {item.label}
                      </Typography.Text>
                      <InputNumber
                        addonAfter="GHS"
                        style={{
                          width: "100%",
                        }}
                        value={item.value}
                        min={0}
                        type="number"
                        onChange={(value) => {
                          item.setValue((value || 0) as any);
                        }}
                      />
                    </Flex>
                  ))}

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
                      style={{
                        width: "100%",
                        textAlign: "right",
                      }}
                      value={total}
                      options={{ style: "currency", currency: "USD" }}
                    />
                  </Flex>
                  {transactions.length > 1 && (
                    <>
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
                        <Input
                          placeholder="Group Title"
                          value={groupTitle}
                          onChange={(e) => setGroupTitle(e.target.value)}
                        />
                      </Flex>
                    </>
                  )}
                </Flex>
              </div>
            </Card>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
};
