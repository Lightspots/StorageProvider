import {UrlQueryHelper} from "./UrlQueryHelper";

export class StorageProvider {

  /**
   * Returns a {@link Storage} which will use the localstorage as storage backend.
   * @param {string} prefix A prefix for all keys managed over this storage instance.
   * @returns {Storage} The storage.
   */
  public static localStorage(prefix?: string): Storage {
    return new StorageImpl((key, value) => localStorage.setItem(key, value),
        (key) => localStorage.getItem(key) || undefined,
        (key) => localStorage.removeItem(key),
        prefix);
  }

  /**
   * Returns a {@link Storage} which will use the sessionstorage as storage backend.
   * @param {string} prefix A prefix for all keys managed over this storage instance.
   * @returns {Storage} The storage.
   */
  public static sessionStorage(prefix?: string): Storage {
    return new StorageImpl((key, value) => sessionStorage.setItem(key, value),
        (key) => sessionStorage.getItem(key) || undefined,
        (key) => sessionStorage.removeItem(key),
        prefix);
  }

  /**
   * Returns a {@link Storage} which will use url get parameters as storage.
   * @param {string} prefix A prefix for all keys managed over this storage instance.
   * @param {UrlMode} mode The mode of how we update the history.
   * @returns {Storage} The storage.
   */
  public static urlStorage(prefix?: string, mode: UrlMode = UrlMode.REPLACE): Storage {
    return new StorageImpl((key, value) => {
          const currentParams = UrlQueryHelper.getQueryValues();
          currentParams[key] = value;
          switch (mode) {
            case UrlMode.REPLACE:
              history.replaceState(null, "", UrlQueryHelper.setParams(currentParams));
              break;
            case UrlMode.PUSH:
              history.pushState(null, "", UrlQueryHelper.setParams(currentParams));
          }
        },
        (key) => {
          return UrlQueryHelper.getQueryValues()[key];
        },
        (key) => {
          const currentParams = UrlQueryHelper.getQueryValues();
          delete currentParams[key];
          switch (mode) {
            case UrlMode.REPLACE:
              history.replaceState(null, "", UrlQueryHelper.setParams(currentParams));
              break;
            case UrlMode.PUSH:
              history.pushState(null, "", UrlQueryHelper.setParams(currentParams));
          }
        }, prefix);
  }

}

/**
 * Mode describing if we want to replace the existing url or push it as new history entry.
 */
export enum UrlMode {
  REPLACE = "REPLACE",
  PUSH = "PUSH"
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
  /**
   * Sets the given value with the given key into the storage.
   * Objects are serialized with <code>JSON.stringify</code>.
   * @param {string} key the key where to save the value
   * @param value the value to store.
   */
  set(key: string, value: any);

  /**
   * Returns the value for the given key as string.
   * This method will always return a value if the key exists, because all values are saved as string!
   * @param {string} key the key of the value to access.
   * @returns {string | undefined} the value if existing or undefined otherwise.
   */
  getAsString(key: string): string | undefined;

  /**
   * Returns the value for the given key as number. Tries to parse the value at the given key as number.
   * @param {string} key the key of the value to access.
   * @returns {number | undefined} the value as number if existing or readable as number. Otherwise undefined!
   */
  getAsNumber(key: string): number | undefined;

  /**
   * Returns the value for the given key as boolean. Tries to parse the value at the given key as boolean.
   * @param {string} key the key of the value to access.
   * @returns {boolean | undefined} the value as boolean if existing or readable as boolean. Otherwise undefined!
   */
  getAsBoolean(key: string): boolean | undefined;

  /**
   * Returns the value for the given key as object. Uses JSON.parse for parsing.
   * @param {string} key the key of the value to access.
   * @returns {object | undefined} the object if JSON.parse is able to read it, otherwise undefined.
   */
  getAsObject(key: string): object | undefined;

  /**
   * Uses same logic as {@link getAsObject}. Use {@link getAsObject} for other arrays.
   * @param {string} key the key of the value to access.
   * @returns {string[] | undefined} the string[] if the stored value is readable as string[], otherwise undefined.
   */
  getAsArray(key: string): string[] | undefined;

  /**
   * Similar to {@link getAsString}
   * @param {string} key the key of the value to access.
   * @returns {string | undefined} the value if existing or undefined otherwise.
   */
  get(key: string): string | undefined;

  /**
   * Deletes the given key from the storage.
   * @param {string} key the key of the value to delete.
   */
  del(key: string);
}
