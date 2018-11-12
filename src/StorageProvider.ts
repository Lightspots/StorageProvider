import { HistoryMode } from "./HistoryMode";
import { LocalStorage } from "./internal/LocalStorage";
import { SessionStorage } from "./internal/SessionStorage";
import { UrlStorage } from "./internal/UrlStorage";
import { Storage } from "./Storage";

export class StorageProvider {

  /**
   * Returns a {@link Storage} which will use the localstorage as storage backend.
   * @param {string} prefix A prefix for all keys managed over this storage instance.
   * @returns {Storage} The storage.
   */
  public static localStorage(prefix?: string): Storage {
    return new LocalStorage(prefix);
  }

  /**
   * Returns a {@link Storage} which will use the sessionstorage as storage backend.
   * @param {string} prefix A prefix for all keys managed over this storage instance.
   * @returns {Storage} The storage.
   */
  public static sessionStorage(prefix?: string): Storage {
    return new SessionStorage(prefix);
  }

  /**
   * Returns a {@link Storage} which will use url get parameters as storage.
   * @param {string} prefix A prefix for all keys managed over this storage instance.
   * @param {HistoryMode} mode The mode of how we update the history.
   * @returns {Storage} The storage.
   */
  public static urlStorage(prefix?: string, mode: HistoryMode = HistoryMode.REPLACE): Storage {
    return new UrlStorage(prefix, mode);
  }

}
