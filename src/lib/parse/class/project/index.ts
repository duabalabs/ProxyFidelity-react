import { IProject } from "./types"
import { ParseBaseClass } from "../baseClasses";

export const PROJECT_CLASSNAME = "Project";
export interface Project extends IProject {}
export class Project extends ParseBaseClass {
  constructor(project?: IProject) {
    super(PROJECT_CLASSNAME);
    if
    (project) {
      this.fromObject(project);
    }
  }
}
