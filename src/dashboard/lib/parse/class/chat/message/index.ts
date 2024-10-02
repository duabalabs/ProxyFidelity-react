import { IMessage } from "./types"
import { ParseBaseClass } from "../../baseClasses";

export const MESSAGE_CLASSNAME = "Message";

export interface Message extends IMessage {}
export class Message extends ParseBaseClass {
  constructor(message?: IMessage) {
    super(MESSAGE_CLASSNAME);
    this.fromObject(message);
  }
}
