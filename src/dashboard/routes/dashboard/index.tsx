import React from "react";

import { useCustom, useList } from "@refinedev/core";

import { Col, Row } from "antd";

import { CalendarUpcomingEvents } from "@/dashboard/components";
import type { DashboardTotalCountsQuery } from "@/dashboard/graphql/types";

import {
  CompaniesMap,
  DashboardDealsChart,
  DashboardLatestActivities,
  DashboardTasksChart,
  DashboardTotalCountCard,
  DashboardTotalRevenueChart,
} from "./components";
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "./queries";

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useList({
    resource: 'Project', // Resource name
    pagination: {
      current: 1,
      pageSize: 10,
    }
  });

  console.log(data, isLoading, error);
  // const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
  //   url: "",
  //   method: "get",
  //   meta: { gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY },
  // });

  return (
    <div className="page-container">
      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col xs={24} sm={24} xl={14} xxl={16}>
          <DashboardLatestActivities />
        </Col>
        <Col xs={24} sm={24} xl={10} xxl={8}>
          <CalendarUpcomingEvents showGoToListButton />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "448px",
          }}
        >
          <DashboardTasksChart />
        </Col>
        <Col
          xs={24}
          sm={24}
          xl={16}
          style={{
            height: "448px",
          }}
        >
          <CompaniesMap />
        </Col>
      </Row>
    </div>
  );
};
