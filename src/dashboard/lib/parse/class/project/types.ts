import Parse from 'parse'
import { User } from '../user';

export interface IProject extends Parse.Object {
  user: User;
  name: string;
  email: string;
  description: string;
}
