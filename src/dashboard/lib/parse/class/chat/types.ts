import Parse from 'parse'
import { Message, Order, User } from "..";
export interface IGetChatParams {
  type: CHAT_TYPE;
  users?: User[];
  order?: Order;
  createIfNotExist?: boolean;
}
export enum CHAT_TYPE {
  ORDER_CUSTOMER_AND_RIDER = "ORDER_CUSTOMER_AND_RIDER",
  ORDER_SHOP_AND_RIDER = "ORDER_SHOP_AND_RIDER",
  SUPPORT = "SUPPORT",
  PARTNER_TO_PARTNER = "PARTNER_TO_PARTNER",
  PARTNER_TO_STAFF = "PARTNER_TO_STAFF",
}
export interface IChat extends Parse.Object {
  users: User[];
  type: CHAT_TYPE;
  messages: Message[];
  order?: Order;
  supportTicket?: string;
}
