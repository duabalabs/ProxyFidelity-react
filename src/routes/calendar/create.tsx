import React, { useState } from "react";

import { useForm, useModalForm } from "@refinedev/antd";
import { type HttpError, useNavigation } from "@refinedev/core";

import { Modal } from "antd";
import dayjs from "dayjs";

import { useAppData } from "@/context";
import type { EventCreateInput } from "@/graphql/schema.types";
import { CalendarEvent, CALENDAREVENT_CLASSNAME } from "@/lib";

import { CalendarForm } from "./components";

type FormValues = EventCreateInput & {
  rangeDate: [dayjs.Dayjs, dayjs.Dayjs];
  date: dayjs.Dayjs;
  time: [dayjs.Dayjs, dayjs.Dayjs];
  color: any;
};

export const CalendarCreatePage: React.FC = () => {
  const [isAllDayEvent, setIsAllDayEvent] = useState(false);
  const { list } = useNavigation();
  const { activeProject } = useAppData();

  const { formProps, modalProps, close, onFinish } = useModalForm<
    CalendarEvent,
    HttpError
  >({
    resource: CALENDAREVENT_CLASSNAME,
    action: "create",
  });

  const form = formProps.form;
  const handleOnFinish = async (values: FormValues) => {
    const { rangeDate, date, time, color, ...otherValues } = values;

    let startDate = dayjs();
    let endDate = dayjs();

    if (rangeDate) {
      startDate = rangeDate[0].startOf("day");
      endDate = rangeDate[1].endOf("day");
    } else {
      startDate = date
        .set("hour", time[0].hour())
        .set("minute", time[0].minute())
        .set("second", 0);

      endDate = date
        .set("hour", time[1].hour())
        .set("minute", time[1].minute())
        .set("second", 0);
    }

    await onFinish({
      ...otherValues,
      project: activeProject,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      color: typeof color === "object" ? `#${color.toHex()}` : color,
    } as any);

    form.resetFields();
    close();
    list(CALENDAREVENT_CLASSNAME, "replace");
  };

  return (
    <Modal
      title="Create Event"
      {...modalProps}
      open
      onCancel={() => {
        list("events");
      }}
      width={560}
    >
      <CalendarForm
        isAllDayEvent={isAllDayEvent}
        setIsAllDayEvent={setIsAllDayEvent}
        form={form}
        formProps={{
          ...formProps,
          onFinish: handleOnFinish,
        }}
      />
    </Modal>
  );
};
