import Parse from "parse";

import { Project } from "../project";
import { Transaction } from ".";

/**
 * Interface representing a transaction.
 * Extends Parse.Object to include Parse-specific properties and methods.
 */
export interface ITransaction extends Parse.Object {
  /**
   * Title or description of the transaction.
   * @type {string}
   */
  title?: string;

  /**
   * Unit price of the item involved in the transaction.
   * @type {number}
   */
  unitPrice?: number;

  /**
   * Quantity of items involved in the transaction.
   * @type {number}
   */
  quantity?: number;

  /**
   * Discount applied to the transaction.
   * @type {number}
   */
  discount?: number;

  /**
   * Tax applied to the transaction.
   * @type {number}
   */
  tax?: number;

  /**
   * Shipping cost associated with the transaction.
   * @type {number}
   */
  shipping?: number;

  /**
   * Subtotal amount before tax and shipping.
   * @type {number}
   */
  subTotal?: number;

  /**
   * Total amount after applying tax and shipping.
   * @type {number}
   */
  total?: number;

  /**
   * Vendor associated with the transaction.
   * @type {string}
   */
  vendor?: string;

  /**
   * Date of the transaction.
   * @type {string}
   */
  date?: string;

  /**
   * Indicates if the transaction is a parent transaction.
   * @type {boolean}
   */
  isParent?: boolean;

  /**
   * Project associated with the transaction.
   * @type {Project}
   */
  project?: Project;

  approved?: boolean;

  /**
   * List of related transactions.
   * @type {Transaction[]}
   */
  transactions?: Transaction[];
}
