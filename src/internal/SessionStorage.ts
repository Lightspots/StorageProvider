import { AbstractStorage } from "./AbstractStorage";

export class SessionStorage extends AbstractStorage {

  public constructor(prefix?: string) {
    super(prefix);
  }

  public del(key: string | string[]) {
    if (Array.isArray(key)) {
      key.forEach((k) => sessionStorage.removeItem(this.concat(k)));
    } else {
      sessionStorage.removeItem(this.concat(key));
    }
  }

  public get(key: string): string | undefined {
    let value: string | undefined | null = sessionStorage.getItem(this.concat(key));
    if (value === null) {
      value = undefined;
    }
    return value;
  }

  public set(key: string | { [index: string]: any }, value?: any) {
    if (typeof key === "string" && value !== undefined) {
      sessionStorage.setItem(this.concat(key), this.prepareValue(value));
    } else if (typeof key === "object") {
      for (const k of Object.keys(key)) {
        sessionStorage.setItem(this.concat(k), this.prepareValue(key[k]));
      }
    } else {
      throw new Error("Either specify key, value or an object containing multiple key/value pairs");
    }
  }

  public size(): number {
    let count = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)!;
      if (this.prefix) {
        if (key.indexOf(this.prefix) === 0) {
          count++;
        }
      } else {
        count++;
      }
    }
    return count;
  }

}
