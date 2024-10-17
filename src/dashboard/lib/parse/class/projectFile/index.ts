import { ParseBaseClass } from "../baseClasses";
import { IProjectFile } from "./types"

export const PROJECTFILE_CLASSNAME = "ProjectFile";
export interface ProjectFile extends IProjectFile { }
export class ProjectFile extends ParseBaseClass {
  constructor(projectfile?: IProjectFile) {
    super(PROJECTFILE_CLASSNAME);
    this.fromObject(projectfile);
  }

}
