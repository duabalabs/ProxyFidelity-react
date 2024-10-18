import Parse from "parse";

import { Project } from "../project";

export interface IProjectFile extends Parse.Object {
  project?: Project;
  fileName?: string;
  fileType?: string;
  description?: string;
  fileUrl?: string;
  cdnUrl?: string;
}
