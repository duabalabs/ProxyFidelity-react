"use client";

import Parse from "parse";

import { ParseUserBaseClass } from "../baseClasses";
import { ROLETYPE } from "../role/types";
import { IUser } from "./types";

export const USER_CLASSNAME = (Parse.User as any).className;

export interface User extends IUser {}
export class User extends ParseUserBaseClass {
  constructor(user: IUser) {
    super();
    this.fromObject(user);
  }

  get name() {
    return this.get("name") ?? this.get("username");
  }

  get isSuperAdmin() {
    return this.get("role").getName() === ROLETYPE.SUPERADMIN;
  }
  get isAdmin() {
    return this.get("role").getName() === ROLETYPE.ADMIN;
  }
  get isSupervisor() {
    return this.get("role").getName() === ROLETYPE.SUPERVISOR;
  }
  get isStaff() {
    return this.get("role").getName() === ROLETYPE.STAFF;
  }
  get isClient() {
    return this.get("role").getName() === ROLETYPE.CLIENT;
  }
}
