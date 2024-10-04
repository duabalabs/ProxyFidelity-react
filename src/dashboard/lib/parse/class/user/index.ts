"use client";

import Parse from 'parse'

import { ParseUserBaseClass } from "../baseClasses";
import { IUser } from "./types";

export const USER_CLASSNAME = (Parse.User as any).className;

export interface User extends IUser { }
export class User extends ParseUserBaseClass { }
