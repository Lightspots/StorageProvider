import { Storage, StorageValue } from "../Storage";

export abstract class AbstractStorage implements Storage {
  protected readonly prefix: string | undefined;

  protected constructor(prefix?: string) {
    this.prefix = prefix;
  }

  public getAsString(key: string): string | undefined {
    return this.get(key);
  }

  public getAsNumber(key: string): number | undefined {
    const value = Number(this.get(key));
    if (Number.isNaN(value)) {
      return undefined;
    }
    return value;
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

  public getAsRecord(key: string): Record<string, unknown> | undefined {
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

  public getAsObject<T extends Record<string, unknown>>(
    key: string,
    typeCheck: (o: Record<string, unknown>) => boolean = () => true,
  ): T | undefined {
    const record = this.getAsRecord(key);
    if (record !== undefined && typeCheck(record)) {
      return record as T;
    } else {
      return undefined;
    }
  }

  public getAsArray(key: string): StorageValue[] | undefined {
    const o = this.getAsRecord(key);
    if (o && Array.isArray(o)) {
      return o;
    } else {
      return undefined;
    }
  }

  public abstract del(key: string | string[]): void;

  public abstract get(key: string): string | undefined;

  public abstract set(key: string, value: StorageValue | StorageValue[]): void;
  public abstract set(keyValueMap: {
    [index: string]: StorageValue | StorageValue[];
  }): void;

  public abstract size(): number;

  public isEmpty(): boolean {
    return this.size() === 0;
  }

  protected concat(key: string): string {
    if (this.prefix) {
      return `${this.prefix}_${key}`;
    } else {
      return key;
    }
  }

  protected prepareValue(value: StorageValue | StorageValue[]): string {
    switch (typeof value) {
      case "boolean":
      case "number":
      case "string":
        return value.toString();
      case "object":
        return JSON.stringify(value);
      default:
        throw new Error("Invalid type of value");
    }
  }
}
