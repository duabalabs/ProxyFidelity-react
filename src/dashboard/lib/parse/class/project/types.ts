import Parse from 'parse'

import { User } from '../user';

export interface IProject extends Parse.Object {
  client: User;
  name: string;
  email: string;
  description: string;
}
