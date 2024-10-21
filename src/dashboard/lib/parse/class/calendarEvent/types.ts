import Parse from "parse";

import { Project } from "../project";
import { User } from "../user";

export interface ICalendarEvent extends Parse.Object {
  project?: Project;
  startDate?: string;
  endDate?: string;
  title?: string;
  description?: string;
  color?: string;
}
