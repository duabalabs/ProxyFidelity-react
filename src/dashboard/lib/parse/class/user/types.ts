import { UserRoles } from '@types';
import Parse from 'parse'
export interface IUser extends Parse.User {
  username: string;
  email: string;
  role: UserRoles;
  phone: string;
  password: string;
  emailVerified: boolean;

  //OTHERs
  averageRating: string;
  ratings: string;
}

