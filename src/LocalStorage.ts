import { AbstractStorage } from "./AbstractStorage";

export class LocalStorage extends AbstractStorage {

  public constructor(prefix?: string) {
    super(prefix);
  }

  public del(key: string | string[]) {
    if (Array.isArray(key)) {
      key.forEach((k) => localStorage.removeItem(this.concat(k)));
    } else {
      localStorage.removeItem(this.concat(key));
    }
  }

  public get(key: string): string | undefined {
    let value: string | undefined | null = localStorage.getItem(this.concat(key));
    if (value === null) {
      value = undefined;
    }
    return value;
  }

  public set(key: string | { [index: string]: any }, value?: any) {
    if (typeof key === "string" && value !== undefined) {
      localStorage.setItem(this.concat(key), this.prepareValue(value));
    } else if (typeof key === "object") {
      for (const k of Object.keys(key)) {
        localStorage.setItem(this.concat(k), this.prepareValue(key[k]));
      }
    } else {
      throw new Error("Either specify key, value or an object containing multiple key/value pairs");
    }
  }

}
