import { useMemo, useState } from "react";

import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Define color palette for charts
const COLORS = ["#FF6B6B", "#4CAF50"];

export const TransactionChartAnalysis = ({ tableProps }) => {
  const [filter, setFilter] = useState("monthly");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );

  // Process data for spending vs. budget addition
  const processedData = useMemo(() => {
    if (!tableProps?.dataSource) return [];

    // Group transactions by month
    const groupedByMonth = tableProps.dataSource.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString("default", { month: "short" });
      const type = transaction.deposit ? "budgetAdded" : "spent";

      if (!acc[month]) acc[month] = { month, spent: 0, budgetAdded: 0 };
      acc[month][type] += Math.abs(transaction.total);

      return acc;
    }, {});

    return Object.values(groupedByMonth);
  }, [tableProps.dataSource]);

  // Total calculations for summary
  const { totalSpent, totalBudgetAdded } = useMemo(() => {
    if (!tableProps?.dataSource) return { totalSpent: 0, totalBudgetAdded: 0 };

    return tableProps.dataSource.reduce(
      (totals, transaction) => {
        if (transaction.deposit) {
          totals.totalBudgetAdded += Math.abs(transaction.total);
        } else {
          totals.totalSpent += Math.abs(transaction.total);
        }
        return totals;
      },
      { totalSpent: 0, totalBudgetAdded: 0 }
    );
  }, [tableProps.dataSource]);

  const remainingBudget = totalBudgetAdded - totalSpent;

  // Pie chart data for budget usage
  const pieChartData = [
    { name: "Spent", value: totalSpent },
    { name: "Remaining", value: remainingBudget > 0 ? remainingBudget : 0 },
  ];

  // // Download filtered transactions as a report
  // const downloadReport = (format) => {
  //   const filteredTransactions = tableProps.dataSource?.filter(
  //     (transaction) => {
  //       if (!dateRange) return true;
  //       const transactionDate = dayjs(transaction.date);
  //       return (
  //         transactionDate.isSameOrAfter(dateRange[0], "day") &&
  //         transactionDate.isSameOrBefore(dateRange[1], "day")
  //       );
  //     }
  //   );

  //   // Generate downloadable report logic here
  //   console.log(`Downloading ${format} report:`, filteredTransactions);
  // };

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <Typography.Title level={4} style={{ marginBottom: "16px" }}>
        App Completion Financial Analysis
      </Typography.Title>

      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Financial Summary */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Total Budget Added"
                value={`$${totalBudgetAdded.toFixed(2)}`}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Total Spent"
                value={`$${totalSpent.toFixed(2)}`}
                valueStyle={{ color: "#FF6B6B" }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Remaining Budget"
                value={`$${remainingBudget.toFixed(2)}`}
                valueStyle={{
                  color: remainingBudget > 0 ? "#4CAF50" : "#FF6B6B",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filter Section */}
        <Row justify="end" style={{ marginBottom: "16px" }}>
          <Select
            value={filter}
            onChange={(value) => setFilter(value)}
            style={{ width: 200, marginRight: "16px" }}
            options={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly" },
            ]}
            placeholder="Select Filter"
          />
          <DatePicker.RangePicker
            onChange={(dates) => setDateRange(dates)}
            style={{ marginRight: "16px" }}
          />
          {/* <Button
            type="primary"
            onClick={() => downloadReport("PDF")}
            style={{ marginRight: "8px" }}
          >
            Download PDF
          </Button>
          <Button type="default" onClick={() => downloadReport("Excel")}>
            Download Excel
          </Button> */}
        </Row>

        {/* Charts Section */}
        <Row gutter={[16, 16]}>
          {/* Bar Chart: Spending vs Budget Addition */}
          <Col xs={24} lg={12}>
            <Card
              title="Spending vs Budget Addition (Monthly)"
              bordered={false}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processedData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="spent" fill={COLORS[0]} name="Spent" />
                  <Bar
                    dataKey="budgetAdded"
                    fill={COLORS[1]}
                    name="Budget Added"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Pie Chart: Budget Usage */}
          <Col xs={24} lg={12}>
            <Card title="Budget Usage Breakdown" bordered={false}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={(entry) =>
                      `${entry.name} (${entry.value.toFixed(2)})`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default TransactionChartAnalysis;
