import { UrlQueryHelper } from "./UrlQueryHelper";

export class StorageProvider {

  public static localStorage(prefix?: string): Storage {
    return new StorageImpl((key, value) => localStorage.setItem(key, value),
      (key) => localStorage.getItem(key) || undefined,
      (key) => localStorage.removeItem(key),
      prefix);
  }

  public static sessionStorage(prefix?: string): Storage {
    return new StorageImpl((key, value) => sessionStorage.setItem(key, value),
      (key) => sessionStorage.getItem(key) || undefined,
      (key) => sessionStorage.removeItem(key),
      prefix);
  }

  public static urlStorage(prefix?: string): Storage {
    return new StorageImpl((key, value) => {
        const currentParams = UrlQueryHelper.getQueryValues();
        currentParams[key] = value;
        history.replaceState(null, "", UrlQueryHelper.setParams(currentParams));
      },
      (key) => {
        return UrlQueryHelper.getQueryValues()[key];
      },
      (key) => {
        const currentParams = UrlQueryHelper.getQueryValues();
        delete currentParams[key];
        history.replaceState(null, "", UrlQueryHelper.setParams(currentParams));
      }, prefix);
  }

}

class StorageImpl implements Storage {
  private prefix: string | undefined;
  private setFunc: (key: string, value: string) => void;
  private getFunc: (key: string) => string | undefined;
  private removeFunc: (key: string) => void;

  constructor(setFunc: (key: string, value: string) => void,
              getFunc: (key: string) => string | undefined,
              removeFunc: (key: string) => void,
              prefix?: string) {
    this.prefix = prefix;
    this.setFunc = setFunc;
    this.getFunc = getFunc;
    this.removeFunc = removeFunc;
  }

  public set(key: string, value: any) {
    switch (typeof value) {
      case "boolean":
      case "number":
      case "string":
        this.setFunc(this.concat(key), value.toString());
        break;
      case "object":
        this.setFunc(this.concat(key), JSON.stringify(value));
        break;
      default:
        throw new Error("Invalid type of value");
    }
  }

  public getAsString(key: string): string | undefined {
    return this.get(key);
  }

  public getAsNumber(key: string): number | undefined {
    return Number(this.get(key)) || undefined;
  }

  public getAsBoolean(key: string): boolean | undefined {
    const value = this.get(key);
    switch (value) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return undefined;
    }
  }

  public getAsObject(key: string): object | undefined {
    const s = this.get(key);
    if (s) {
      try {
        const o = JSON.parse(s);
        if (o && typeof o === "object") {
          return o;
        }
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  }

  public getAsArray(key: string): string[] | undefined {
    const o = this.getAsObject(key);
    if (o && Array.isArray(o)) {
      return o;
    } else {
      return undefined;
    }
  }

  public get(key: string): string | undefined {
    return this.getFunc(this.concat(key)) || undefined;
  }

  public del(key: string) {
    this.removeFunc(this.concat(key));
  }

  private concat(key: string): string {
    if (this.prefix) {
      return `${this.prefix}_${key}`;
    } else {
      return key;
    }
  }

}

export interface Storage {
  set(key: string, value: any);

  getAsString(key: string): string | undefined;

  getAsNumber(key: string): number | undefined;

  getAsBoolean(key: string): boolean | undefined;

  getAsObject(key: string): object | undefined;

  getAsArray(key: string): string[] | undefined;

  get(key: string): string | undefined;

  del(key: string);
}
