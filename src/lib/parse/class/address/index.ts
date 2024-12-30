import Parse from 'parse'
import { IAddress } from "./types";
import { ParseBaseClass } from "../baseClasses";
export const ADDRESS_CLASSNAME = "Address";
export interface Address extends IAddress { }
export class Address extends ParseBaseClass {
  constructor(address?: IAddress) {
    super(ADDRESS_CLASSNAME);
    if (address && typeof address === "object") {
      this.fromObject(address);
      this.coordinates = new Parse.GeoPoint(this.coordinates);
    }
  }
}