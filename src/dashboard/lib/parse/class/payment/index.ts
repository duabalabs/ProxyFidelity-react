import { IPayment, PAYMENT_METHODS } from "./types"
import { ParseBaseClass } from "../baseClasses";

export const PAYMENT_CLASSNAME = "Payment";
export interface Payment extends IPayment {}
export class Payment extends ParseBaseClass {
  constructor(payment?: Payment) {
    super(PAYMENT_CLASSNAME);
    if (payment && typeof payment === "object") {
      this.fromObject(payment);
    }
  }

  isMomoPayment() {
    return this.method === PAYMENT_METHODS.MOMO;
  }
}
