import Parse from "parse";

import { Role } from "../role";

export interface IUser extends Parse.User {
  username: string;
  email: string;
  role: Role;
  phone: string;
  password: string;
  emailVerified: boolean;
  avatarUrl: string;
  //OTHERs
  averageRating: string;
  ratings: string;
}
