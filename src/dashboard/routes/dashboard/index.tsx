import React from "react";

import { useList } from "@refinedev/core";

import { Col, Row } from "antd";

import { CalendarUpcomingEvents } from "@/dashboard/components";

import {
  DashboardLatestActivities,
} from "./components";

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useList({
    resource: 'Project', // Resource name
    pagination: {
      current: 1,
      pageSize: 10,
    }
  });
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

   
    </div>
  );
};
