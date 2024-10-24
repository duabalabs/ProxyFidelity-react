import { ParseBaseClass } from "../baseClasses";
import { ITransaction } from "./types";

export const TRANSACTION_CLASSNAME = "Transaction";
export interface Transaction extends ITransaction {}
export class Transaction extends ParseBaseClass {
  constructor(transaction?: ITransaction) {
    super(TRANSACTION_CLASSNAME);
    this.fromObject(transaction);
  }
}

export * from "./types";
