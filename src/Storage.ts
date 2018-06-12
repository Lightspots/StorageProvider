export interface Storage {
  /**
   * Sets the given value with the given key into the storage.
   * Objects are serialized with <code>JSON.stringify</code>.
   * @param {string} key the key where to save the value
   * @param value the value to store.
   */
  set(key: string, value: any);

  /**
   * Sets the given key value pairs into the storage.
   * This is considered as single transaction, in stores with transactions.
   * @param {object} keyValueMap a object with multiple key value pairs to write into the storage.
   */
  set(keyValueMap: { [index: string]: any });

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
   * Deletes the given key(s) from the storage.
   * @param {string} key the key of the value to delete.
   */
  del(key: string | string[]);
}
