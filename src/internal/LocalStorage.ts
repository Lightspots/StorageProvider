import { StorageValue } from "../Storage";
import { AbstractStorage } from "./AbstractStorage";

export class LocalStorage extends AbstractStorage {
  public constructor(prefix?: string) {
    super(prefix);
  }

  public del(key: string | string[]): void {
    if (Array.isArray(key)) {
      key.forEach((k) => localStorage.removeItem(this.concat(k)));
    } else {
      localStorage.removeItem(this.concat(key));
    }
  }

  public get(key: string): string | undefined {
    let value: string | undefined | null = localStorage.getItem(
      this.concat(key),
    );
    if (value === null) {
      value = undefined;
    }
    return value;
  }

  public set(
    key: string | { [index: string]: StorageValue | StorageValue[] },
    value?: StorageValue | StorageValue[],
  ): void {
    if (typeof key === "string" && value !== undefined) {
      localStorage.setItem(this.concat(key), this.prepareValue(value));
    } else if (typeof key === "object") {
      for (const k of Object.keys(key)) {
        localStorage.setItem(this.concat(k), this.prepareValue(key[k]));
      }
    } else {
      throw new Error(
        "Either specify key, value or an object containing multiple key/value pairs",
      );
    }
  }

  public size(): number {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (this.prefix) {
        if (key?.indexOf(this.prefix) === 0) {
          count++;
        }
      } else {
        count++;
      }
    }
    return count;
  }
}
