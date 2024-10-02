import { IReview } from "./types";
import { ParseBaseClass } from "../baseClasses";

export const REVIEW_CLASSNAME = "Review";
export interface Review extends IReview {}
export class Review extends ParseBaseClass {
  constructor() {
    super(REVIEW_CLASSNAME);
  }
}
