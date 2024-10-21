import Parse from "parse";

export interface IUser extends Parse.User {
  username: string;
  email: string;
  role: string;
  phone: string;
  password: string;
  emailVerified: boolean;
  avatarUrl: string;
  //OTHERs
  averageRating: string;
  ratings: string;
}
