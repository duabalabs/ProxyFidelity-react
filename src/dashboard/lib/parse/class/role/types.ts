import Parse from "parse";

import { User } from "../user";
import { Role } from ".";

export enum ROLETYPE {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  SUPERVISOR = "supervisor",
  STAFF = "staff",
  CLIENT = "client",
}
export interface IRole extends Parse.Role {
  name: string;
  users: User[];
  roles: Role[];
}
