import Parse from 'parse'
import { User } from '../../user';

export interface IMessage extends Parse.Object {
    text: string;
    user: User;
}
