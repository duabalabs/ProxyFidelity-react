import { EditButton } from "@refinedev/antd";
import { useNavigation, useResource, useShow } from "@refinedev/core";
import type { GetFields } from "@refinedev/nestjs-query";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Skeleton, Tag } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components";
import { CalendarEvent, CALENDAREVENT_CLASSNAME } from "@/lib";

export const CalendarShowPage: React.FC = () => {
  const { id } = useResource();
  const { list } = useNavigation();

  const { query: queryResult } = useShow<CalendarEvent>({
    resource: CALENDAREVENT_CLASSNAME,
    id,
  });

  const { data, isLoading, isError, error } = queryResult;

  if (isError) {
    console.error("Error fetching event", error);
    return null;
  }

  const { description, startDate, endDate } = data?.data ?? {};

  const utcStartDate = dayjs(startDate).utc();
  const utcEndDate = dayjs(endDate).utc();

  // if the event is more than one day, don't show the time
  let allDay = false;
  // check if more then 23 hours
  if (utcEndDate.diff(utcStartDate, "hours") >= 23) {
    allDay = true;
  }

  const handleOnClose = () => {
    list("events");
  };

  return (
    <Drawer
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                backgroundColor: data?.data?.color ?? "blue",
                flexShrink: 0,
                borderRadius: "50%",
                width: "10px",
                height: "10px",
                marginTop: "8px",
              }}
            />
            <Text strong size="md">
              {data?.data.title}
            </Text>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
            <EditButton icon={<EditOutlined />} hideText type="text" />
            <Button
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<CloseOutlined />}
              type="text"
              onClick={handleOnClose}
            />
          </div>
        </div>
      }
      closeIcon={false}
      open
      onClose={handleOnClose}
      width={378}
    >
      {isLoading ? (
        <Skeleton
          loading={isLoading}
          active
          avatar
          paragraph={{
            rows: 3,
          }}
          style={{
            padding: 0,
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {allDay ? (
            <div>
              {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
              <CalendarOutlined style={{ marginRight: ".5rem" }} />
              <Text>{`${dayjs(utcStartDate).format("MMMM D")} - ${dayjs(
                utcEndDate
              ).format("MMMM D")}`}</Text>
              <Tag style={{ marginLeft: ".5rem" }} color="blue">
                All Day
              </Tag>
            </div>
          ) : (
            <>
              <div>
                {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                <CalendarOutlined style={{ marginRight: ".5rem" }} />
                <Text>{dayjs(utcStartDate).format("MMMM D, YYYY dddd")}</Text>
              </div>
              <div>
                {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                <ClockCircleOutlined style={{ marginRight: ".5rem" }} />
                <Text>{`${dayjs(utcStartDate).format("h:mma")} - ${dayjs(
                  utcEndDate
                ).format("h:mma")}`}</Text>
              </div>
            </>
          )}

          <div style={{ display: "flex", alignItems: "start" }}>
            {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
            <InfoCircleOutlined
              style={{
                marginRight: ".5rem",
                marginTop: "0.32rem",
              }}
            />
            <Text>{description}</Text>
          </div>
        </div>
      )}
    </Drawer>
  );
};
