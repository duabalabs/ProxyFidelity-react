import { ParseBaseClass } from "../baseClasses";
import { ITask } from "./types";

export const TASK_CLASSNAME = "Task";
export interface Task extends ITask {}
export class Task extends ParseBaseClass {
  constructor(task?: ITask) {
    super(TASK_CLASSNAME);
    this.fromObject(task);
  }
}
