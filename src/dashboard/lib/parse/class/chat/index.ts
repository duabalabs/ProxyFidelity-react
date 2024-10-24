import { ParseBaseClass } from "../baseClasses";
import { Message } from "../message";
import { IChat } from "./types";

export const CHAT_CLASSNAME = "Chat";

export interface Chat extends IChat {}
export class Chat extends ParseBaseClass {
  constructor() {
    super(CHAT_CLASSNAME);
  }

  addMessages(messages: Message[]) {
    this.addAll("messages", messages);
    this.save();
  }
}

export * from "../message";
