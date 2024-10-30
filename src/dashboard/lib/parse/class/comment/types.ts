import Parse from "parse";

import { Project } from "../project";
import { User } from "../user";

export interface IComment extends Parse.Object {
  project?: Project;
  topicID?: string;
  createdBy?: User;
  comment?: string;
}
