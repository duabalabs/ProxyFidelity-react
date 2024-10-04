import Parse from 'parse/react-native';

import { ParseBaseClass } from './baseClasses';

export class ParseFunctions {
  performAction;
  constructor() {
    this.performAction = ParseFunctions.performAction;
  }
  static performAction = async (
    actionPromise: Promise<any>,
    silent = false,
    successMessage?: string,
    errorMessage?: string
  ) => {
    try {
      const results = await actionPromise;
      if (successMessage) {
        // displayMsg(successMessage);
      }
      return results;
    } catch (error) {
      if (errorMessage) {
        // displayError(errorMessage);
      }
      if (silent) {
        return false;
      }
      throw error;
    }
  };
  static async getParseItem(subClass: ParseBaseClass, objectId: string) {
    const query = new Parse.Query(subClass as any);
    return ParseFunctions.performAction(query.get(objectId));
  }
  static async getFirstParseItem(subClass: ParseBaseClass) {
    const query = new Parse.Query(subClass as any);
    return ParseFunctions.performAction(query.first());
  }
  static async getRandomParseItem(subClass: ParseBaseClass) {
    const query = new Parse.Query(subClass as any);
    query.skip(Math.floor(Math.random() * 20));
    query.limit(1);
    return ParseFunctions.getParseItems(subClass, Math.floor(Math.random() * 20), 1);
  }
  static async getParseItems(
    subClass: ParseBaseClass,
    start = 0,
    limit: number | undefined = undefined,
    constraints?: {
      type:
        | 'equalTo'
        | 'notEqualTo'
        | 'greaterThan'
        | 'lessThan'
        | 'lessThanOrEqualTo'
        | 'greaterThanOrEqualTo'
        | 'containedIn'
        | 'notContainedIn';
      key: string;
      value: any;
    }[]
  ) {
    const query = new Parse.Query(subClass as any);
    if (limit) {
      query.limit(limit);
    }
    if (start) {
      query.skip(start);
    }
    constraints?.forEach((constraint) =>
      query[`${constraint.type}`]?.(constraint.key, constraint.value)
    );
    return ParseFunctions.performAction(query.find());
  }
}
