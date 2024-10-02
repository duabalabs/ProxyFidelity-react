import { IProjectFile } from "./types"
import { ParseBaseClass } from "../baseClasses";

export const PROJECTFILE_CLASSNAME = "ProjectFile";
export interface ProjectFile extends IProjectFile {}
export class ProjectFile extends ParseBaseClass {
  constructor(projectFile?: IProjectFile) {
    super(PROJECTFILE_CLASSNAME);
    this.fromObject(projectFile);
  }

  get projectFileNumber() {
    return this.id;
  }
}
