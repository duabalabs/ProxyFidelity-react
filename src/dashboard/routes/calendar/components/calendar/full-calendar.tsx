import type { Dispatch, FC, RefObject, SetStateAction } from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import { CalendarEvent } from "@/dashboard/lib";

type FullCalendarWrapperProps = {
  calendarRef: RefObject<FullCalendar>;
  events: (Partial<CalendarEvent> & { allDay: boolean })[];
  onClickEvent?: (event: CalendarEvent) => void;
  setTitle: Dispatch<SetStateAction<string | undefined>>;
};

const FullCalendarWrapper: FC<FullCalendarWrapperProps> = ({
  calendarRef,
  events,
  onClickEvent,
  setTitle,
}) => {
  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
      initialView={"dayGridMonth"}
      events={events}
      eventTimeFormat={{
        hour: "2-digit",
        minute: "2-digit",
        meridiem: false,
      }}
      eventClick={({ event }) => {
        onClickEvent?.(
          events.find(({ id }) => id === event.id) as CalendarEvent
        );
      }}
      datesSet={({ view }) => {
        setTitle(view.title);
      }}
      headerToolbar={false}
      timeZone="UTC"
      height={600}
    />
  );
};

export default FullCalendarWrapper;
