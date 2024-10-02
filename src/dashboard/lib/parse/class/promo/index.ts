import { IPromo } from "./types";
import { ParseBaseClass } from "../../baseClasses";

export const PROMO_CLASSNAME = "Promo";
export interface Promo extends IPromo {}
export class Promo extends ParseBaseClass {
  constructor() {
    super(PROMO_CLASSNAME);
  }
}
