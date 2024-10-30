"use client";

import Parse from "parse";

import { ParseRoleBaseClass } from "../baseClasses";
import { IRole } from "./types";

export const ROLE_CLASSNAME = (Parse.Role as any).className;

export interface Role extends IRole {}
export class Role extends ParseRoleBaseClass {
  constructor(role: IRole) {
    super();
    this.fromObject(role);
  }
}
