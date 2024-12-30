import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

import { useList } from "@refinedev/core";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type FullCalendar from "@fullcalendar/react";
import { Button, Card, Grid, Radio } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components";
import { useAppData } from "@/context";
import { CalendarEvent, CALENDAREVENT_CLASSNAME } from "@/lib";

import styles from "./index.module.css";

const FullCalendarWrapper = lazy(() => import("./full-calendar"));

type View =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listMonth"
  | "listDay"
  | "listWeek";

type CalendarProps = {
  categoryId?: string[];
  onClickEvent?: (event: CalendarEvent) => void;
};

export const Calendar: React.FC<CalendarProps> = ({
  categoryId,
  onClickEvent,
}) => {
  const [calendarView, setCalendarView] = useState<View>("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);
  const [title, setTitle] = useState(calendarRef.current?.getApi().view.title);
  const { md } = Grid.useBreakpoint();

  const { activeProject } = useAppData();
  useEffect(() => {
    calendarRef.current?.getApi().changeView(calendarView);
  }, [calendarView]);

  useEffect(() => {
    if (md) {
      setCalendarView("dayGridMonth");
    } else {
      setCalendarView("listMonth");
    }
  }, [md]);

  const { data } = useList<CalendarEvent>({
    resource: CALENDAREVENT_CLASSNAME,
    queryOptions: {
      cacheTime: 0,
    },
    pagination: {
      mode: "off",
    },
    filters: [
      {
        field: "category.id",
        operator: "in",
        value: categoryId?.length ? categoryId : undefined,
      },
      {
        field: "project",
        value: activeProject,
        operator: "eq",
      },
    ],
  });

  const events = (data?.data ?? []).map(
    ({ id, title, startDate, endDate, color }) => ({
      id: id,
      title: title,
      start: startDate,
      end: endDate,
      color: color,
      allDay: dayjs(endDate).utc().diff(dayjs(startDate).utc(), "hours") >= 23,
    })
  );

  return (
    <Card>
      <div className={styles.calendar_header}>
        <div className={styles.actions}>
          <Button
            onClick={() => {
              calendarRef.current?.getApi().prev();
            }}
            shape="circle"
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<LeftOutlined />}
          />
          <Button
            onClick={() => {
              calendarRef.current?.getApi().next();
            }}
            shape="circle"
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<RightOutlined />}
          />
          <Text className={styles.title} size="lg">
            {title}
          </Text>
        </div>

        <Radio.Group value={calendarView}>
          {[
            {
              label: "Month",
              desktopView: "dayGridMonth",
              mobileView: "listMonth",
            },
            {
              label: "Week",
              desktopView: "timeGridWeek",
              mobileView: "listWeek",
            },
            {
              label: "Day",
              desktopView: "timeGridDay",
              mobileView: "listDay",
            },
          ].map(({ label, desktopView, mobileView }) => {
            const view = md ? desktopView : mobileView;
            return (
              <Radio.Button
                key={label}
                value={view}
                onClick={() => {
                  setCalendarView(view as View);
                }}
              >
                {label}
              </Radio.Button>
            );
          })}
          {md && (
            <Radio.Button
              value="listMonth"
              onClick={() => {
                setCalendarView("listMonth");
              }}
            >
              List
            </Radio.Button>
          )}
        </Radio.Group>
      </div>
      <Suspense>
        <FullCalendarWrapper
          {...{ calendarRef, events, onClickEvent, setTitle }}
        />
      </Suspense>
    </Card>
  );
};
