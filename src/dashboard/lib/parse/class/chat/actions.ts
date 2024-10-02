import Parse from 'parse'
import { ParseFunctions } from "../parseFunctions";
import { Chat } from ".";
import { CHAT_TYPE, IGetChatParams } from "./types"

export class ChatActions extends ParseFunctions {
  createNewChat(params: IGetChatParams) {
    const chat = new Chat();
    chat.type = params.type;
    chat.users = params.users;

    switch (params.type) {
      case CHAT_TYPE.ORDER_CUSTOMER_AND_RIDER:
      case CHAT_TYPE.ORDER_SHOP_AND_RIDER:
        chat.order = params.order;
        break;
      default:
        break;
    }
    return this.performAction(chat.save()) as Promise<Chat>;
  }
  fetchChats = async (): Promise<Chat[]> => {
    const query = new Parse.Query(Chat);
    const results = (await this.performAction(query.find())) as Chat[];
    console.log(results);
    return results;
  };
}
