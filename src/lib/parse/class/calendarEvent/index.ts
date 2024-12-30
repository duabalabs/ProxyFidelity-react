import { ParseBaseClass } from "../baseClasses";
import { ICalendarEvent } from "./types";

export const CALENDAREVENT_CLASSNAME = "CalendarEvent";
export interface CalendarEvent extends ICalendarEvent {}
export class CalendarEvent extends ParseBaseClass {
  constructor(calendarevent?: ICalendarEvent) {
    super(CALENDAREVENT_CLASSNAME);
    this.fromObject(calendarevent);
  }
}
