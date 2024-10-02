import Parse from 'parse'
import { Payment, User } from "..";

export interface IWallet extends Parse.Object {
  amount: number;
  user: User;
  paymentMethods: Payment[];
}
