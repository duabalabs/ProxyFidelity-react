import Parse from "parse";

import { Project } from "../project";
import { User } from "../user";

export interface IMessage extends Parse.Object {
  text: string;
  project: Project;
  sender: User;
}
