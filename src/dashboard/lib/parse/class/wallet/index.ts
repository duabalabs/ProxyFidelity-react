import { IWallet } from "./types"
import { ParseBaseClass } from "../../baseClasses";

export const WALLET_CLASSNAME = "Wallet";
export interface Wallet extends IWallet {}
export class Wallet extends ParseBaseClass {
  constructor() {
    super(WALLET_CLASSNAME);
  }
}
