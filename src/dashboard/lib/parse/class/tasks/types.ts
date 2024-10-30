import Parse from "parse";

import { Message } from "../message";
import { Project } from "../project";
import { User } from "../user";

export interface ITask extends Parse.Object {
  project?: Project;
  checkList?: {
    checked: boolean;
    title: string;
  }[];
  completed?: boolean;
  description?: string;
  dueDate?: string;
  stage?: string;
  title?: string;
  users: User[];
  comments: Message[];
}
