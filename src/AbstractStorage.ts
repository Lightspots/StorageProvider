import { Storage } from "./Storage";

export abstract class AbstractStorage implements Storage {
  protected readonly prefix: string | undefined;

  protected constructor(prefix?: string) {
    this.prefix = prefix;
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

  public abstract del(key: string | string[]);

  public abstract get(key: string): string | undefined;

  public abstract set(key: string, value: any);
  public abstract set(keyValueMap: { [index: string]: any });

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

  protected prepareValue(value: any): string {
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
