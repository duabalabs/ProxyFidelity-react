import Parse from 'parse'

const getter = (object: any, key: string) => {
    //TODO: Notes: We probably need to define more rules for trapping properties on the proxy classes.
    // So far we have just functions and the default is getting parse properties
    return object.get(key) ?? object[key];
};

const setter = (object: any, key: string, value: any) => {
    object.set(key, value);
    return true;
};

export class BaseClass {
    constructor() {
      return new Proxy(this, {
        set: (object: any, key: string, value: any) => {
          object[key] = value;
          return true;
        },
        get: (object: any, key: string) => {
          //TODO: Notes: We probably need to define more rules for trapping properties on the proxy classes.
          // So far we have just functions and the default is getting parse properties
          return object[key];
        },
      });
    }
  
    fromObject(obj: any) {
      Object.assign(this, obj);
    }
  }

export class ParseBaseClass extends Parse.Object {
    constructor(CLASSNAME: string) {
        super(CLASSNAME);
        return new Proxy(this, {
            set: setter,
            get: getter,
        });
    }

    fromObject(obj: any) {
        if (typeof obj === "object") {
            const objectId = obj.objectId ?? obj.id;
            if (objectId) {
                this.id = objectId;
                delete obj.objectId;
                delete obj.id;
            }
            Object.assign(this, obj);
        }
    }

}

export class LocalParseBaseClass extends ParseBaseClass {
    save = async (): Promise<any> => {
        return this.pin();
    };
}

export class ParseUserBaseClass extends Parse.User {
    constructor() {
        super(Parse.User.className);
        return new Proxy(this, {
            set: setter,
            get: getter,
        });
    }

    fromObject(obj: any) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}
