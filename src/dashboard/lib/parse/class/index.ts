import { SubClass } from "../initialize";
import { Address, ADDRESS_CLASSNAME } from "./address";
import { CalendarEvent, CALENDAREVENT_CLASSNAME } from "./calendarEvent";
import { Comment, COMMENT_CLASSNAME } from "./comment";
import { Project, PROJECT_CLASSNAME } from "./project";
import { ProjectFile, PROJECTFILE_CLASSNAME } from "./projectFile";
import { Role, ROLE_CLASSNAME } from "./role";
import { Task, TASK_CLASSNAME } from "./tasks";
import { Transaction, TRANSACTION_CLASSNAME } from "./transaction";
import { User, USER_CLASSNAME } from "./user";

const CustomSubClasses: SubClass[] = [
  {
    className: ADDRESS_CLASSNAME,
    class: Address as any,
  },
  {
    className: PROJECT_CLASSNAME,
    class: Project as any,
  },
  {
    className: PROJECTFILE_CLASSNAME,
    class: ProjectFile as any,
  },
  {
    className: USER_CLASSNAME,
    class: User as any,
  },
  {
    className: ROLE_CLASSNAME,
    class: Role as any,
  },
  {
    className: CALENDAREVENT_CLASSNAME,
    class: CalendarEvent as any,
  },
  {
    className: TRANSACTION_CLASSNAME,
    class: Transaction as any,
  },
  {
    className: TASK_CLASSNAME,
    class: Task as any,
  },
  {
    className: COMMENT_CLASSNAME,
    class: Comment as any,
  },
];
export const SubClasses: SubClass[] = [...CustomSubClasses];

export * from "./address";
export * from "./calendarEvent";
export * from "./chat";
export * from "./comment";
export * from "./project";
export * from "./projectFile";
export * from "./role";
export * from "./tasks";
export * from "./transaction";
export * from "./user";
