import { ParseBaseClass } from "../baseClasses";
import { IComment } from "./types";

export const COMMENT_CLASSNAME = "Comment";
export interface Comment extends IComment {}
export class Comment extends ParseBaseClass {
  constructor(comment?: IComment) {
    super(COMMENT_CLASSNAME);
    this.fromObject(comment);
  }
}
