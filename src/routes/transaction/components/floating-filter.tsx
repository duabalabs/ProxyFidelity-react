import React, { useMemo, useState } from "react";

import {
  Button,
  Col,
  DatePicker,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";

export const FloatingFilter = ({ tableProps, setFilteredData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filter, setFilter] = useState("monthly");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const handleFilterApply = () => {
    // Apply filtering logic to `tableProps.dataSource`
    const filtered = tableProps.dataSource?.filter((transaction) => {
      if (!dateRange) return true; // If no date range is set, include all transactions

      const transactionDate = dayjs(transaction.date); // Parse the transaction date
      const startDate = dateRange[0] ? dayjs(dateRange[0]) : null; // Start date from range
      const endDate = dateRange[1] ? dayjs(dateRange[1]) : null; // End date from range

      return (
        (!startDate || !transactionDate.isBefore(startDate, "day")) && // Transaction date is not before start date
        (!endDate || !transactionDate.isAfter(endDate, "day")) // Transaction date is not after end date
      );
    });

    setFilteredData(filtered || []); // Update the filtered data
    setIsModalVisible(false); // Close the modal
  };

  return (
    <>
      {/* Floating Filter Button */}
      <Button
        type="primary"
        shape="circle"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => setIsModalVisible(true)}
      >
        Filter
      </Button>

      {/* Filter Modal */}
      <Modal
        title="Filter Transactions"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleFilterApply}
        okText="Apply Filter"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* Filter by Type */}
          <Row>
            <Col span={24}>
              <Typography.Text>Filter by Type</Typography.Text>
              <Select
                value={filter}
                onChange={(value) => setFilter(value)}
                style={{ width: "100%", marginTop: "8px" }}
                options={[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ]}
                placeholder="Select Filter Type"
              />
            </Col>
          </Row>

          {/* Filter by Date Range */}
          <Row style={{ marginTop: "16px" }}>
            <Col span={24}>
              <Typography.Text>Select Date Range</Typography.Text>
              <DatePicker.RangePicker
                onChange={(dates) => setDateRange(dates)}
                style={{ width: "100%", marginTop: "8px" }}
              />
            </Col>
          </Row>
        </Space>
      </Modal>
    </>
  );
};

export default FloatingFilter;
