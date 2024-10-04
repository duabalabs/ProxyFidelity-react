"use client";

import Parse from 'parse';

import { ParseBaseClass } from '../class/baseClasses';

export interface IParseServerAPICred {
  serverURL: string;
  appId: string;
  javascriptKey: string;
}

export interface SubClass {
  className: string;
  class: ParseBaseClass;
}

export class ParseInitialize {
  initialized = false;
  constructor(config: IParseServerAPICred, subClasses?: SubClass[]) {
    this.initialize(config, subClasses);
  }
  protected initialize(config: IParseServerAPICred, subClasses?: SubClass[]) {

    Parse.initialize(config.appId, config.javascriptKey);
    Parse.serverURL = config.serverURL;
    this.initialized = true;
    if (subClasses) {
      this.registerParseSubClasses(subClasses);
    }
  }
  registerParseSubClasses(subClasses: SubClass[]) {
    subClasses.forEach((subClass) =>
      Parse.Object.registerSubclass(subClass.className, subClass.class as any)
    );
  }
}
