import { HistoryMode } from "../HistoryMode";
import { StorageValue } from "../Storage";
import { AbstractStorage } from "./AbstractStorage";

export class UrlStorage extends AbstractStorage {
  private readonly mode: HistoryMode;

  public constructor(prefix?: string, mode: HistoryMode = HistoryMode.REPLACE) {
    super(prefix);
    this.mode = mode;
  }

  public del(key: string | string[]): void {
    const currentParams = this.getQueryValues();
    if (Array.isArray(key)) {
      for (const k of key) {
        delete currentParams[this.concat(k)];
      }
    } else {
      delete currentParams[this.concat(key)];
    }
    this.updateUrl(currentParams);
  }

  public get(key: string): string | undefined {
    return this.getQueryValues()[this.concat(key)];
  }

  public set(
    key: string | { [index: string]: StorageValue | StorageValue[] },
    value?: StorageValue | StorageValue[]
  ): void {
    const currentParams = this.getQueryValues();
    if (typeof key === "string" && value !== undefined) {
      currentParams[this.concat(key)] = this.prepareValue(value);
    } else if (typeof key === "object") {
      for (const k of Object.keys(key)) {
        currentParams[this.concat(k)] = this.prepareValue(key[k]);
      }
    } else {
      throw new Error(
        "Either specify key, value or an object containing multiple key/value pairs"
      );
    }
    this.updateUrl(currentParams);
  }

  public size(): number {
    let keys = Object.keys(this.getQueryValues());
    const p = this.prefix;
    if (p) {
      keys = keys.filter((it) => it.indexOf(p) === 0);
    }
    return keys.length;
  }

  private updateUrl(params: { [index: string]: string }): void {
    switch (this.mode) {
      case HistoryMode.REPLACE:
        history.replaceState(null, "", this.setParams(params));
        break;
      case HistoryMode.PUSH:
        history.pushState(null, "", this.setParams(params));
    }
  }

  private getQueryValues(): { [index: string]: string } {
    const query = window.location.search.substring(1);
    const params = query.split("&");
    const returnValue: { [i: string]: string } = {};
    for (const p of params) {
      const pair = p.split("=");
      if (pair.length === 2) {
        returnValue[this.decodeComponent(pair[0])] = this.decodeComponent(
          pair[1]
        );
      }
    }
    return returnValue;
  }

  private join(...params: string[]): string {
    let queryString = "";
    for (const param of params) {
      if (param) {
        if (!queryString) {
          queryString = "?";
        }
        queryString += param;
        queryString += "&";
      }
    }
    return queryString.substring(0, queryString.length - 1);
  }

  private setParams(params: { [index: string]: string }): string {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const path = window.location.pathname;
    const hash = window.location.hash;
    const paramsArray: string[] = [];
    for (const k of Object.keys(params)) {
      paramsArray.push(
        `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
      );
    }
    const joinedParams = this.join(...paramsArray);
    return `${protocol}//${host}${path}${joinedParams}${hash}`;
  }

  private decodeComponent(component: string): string {
    return decodeURIComponent(component.replace(/\+/g, "%20"));
  }
}
