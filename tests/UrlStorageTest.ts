import "jest";
import { HistoryMode, Storage, StorageProvider } from "../src";
import { UrlQueryHelper } from "../src/UrlQueryHelper";

let storage: Storage;

const KEY = "abc";

beforeEach(() => {
  storage = StorageProvider.urlStorage("test");
  history.replaceState(null, "", UrlQueryHelper.setParams({}));
});

function expectKeyValue(key: string, value: string) {
  expect(window.location.search.substring(1)).toEqual(key + "=" + value);
}

describe("key concatenation works correctly", () => {
  test("on get", () => {
    history.replaceState(null, "", UrlQueryHelper.setParams({ test_abc: "someValue" }));
    expect(storage.get(KEY)).toEqual("someValue");
  });
  test("on set", () => {
    storage.set(KEY, "someValue");
    expectKeyValue("test_" + KEY, "someValue");
  });
  test("on del", () => {
    history.replaceState(null, "", UrlQueryHelper.setParams({ test_abc: "someValue" }));
    storage.del(KEY);
    expect(window.location.search).toEqual("");
  });
});

describe("test with multiple url params", () => {
  test("two own url params in different prefixes", () => {
    const storage2 = StorageProvider.urlStorage();
    storage.set(KEY, "prefixedValue");
    storage2.set(KEY, "value");
    expect(window.location.search).toContain(KEY + "=value");
    expect(window.location.search).toContain("test_" + KEY + "=prefixedValue");
  });
});

describe("set does correctly serialize values of type", () => {
  test("string", () => {
    storage.set(KEY, "someValue");
    expectKeyValue("test_" + KEY, "someValue");
  });

  test("boolean", () => {
    storage.set(KEY, true);
    expectKeyValue("test_" + KEY, "true");
  });

  test("number", () => {
    storage.set(KEY, -524.6);
    expectKeyValue("test_" + KEY, "-524.6");
  });

  test("object", () => {
    storage.set(KEY, { name: "Jane Doe" });
    expectKeyValue("test_" + KEY, "%7B%22name%22%3A%22Jane%20Doe%22%7D");
  });

  test("array", () => {
    storage.set(KEY, ["eins", "zwei"]);
    expectKeyValue("test_" + KEY, "%5B%22eins%22%2C%22zwei%22%5D");
  });
});

describe("get value of type string as ", () => {
  test("any returns value", () => {
    storage.set(KEY, "someValue");
    expect(storage.get(KEY)).toBe("someValue");
  });

  test("string returns value", () => {
    storage.set(KEY, "someValue");
    expect(storage.getAsString(KEY)).toBe("someValue");
  });

  test("number returns undefined", () => {
    storage.set(KEY, "someValue");
    expect(storage.getAsNumber(KEY)).toBe(undefined);
  });

  test("boolean returns undefined", () => {
    storage.set(KEY, "someValue");
    expect(storage.getAsBoolean(KEY)).toBe(undefined);
  });

  test("object returns undefined", () => {
    storage.set(KEY, "someValue");
    expect(storage.getAsObject(KEY)).toBe(undefined);
  });

  test("array returns undefined", () => {
    storage.set(KEY, "someValue");
    expect(storage.getAsArray(KEY)).toBe(undefined);
  });
});

describe("get value of type number as ", () => {
  test("any returns value as string", () => {
    storage.set(KEY, -25.6);
    expect(storage.get(KEY)).toBe("-25.6");
  });

  test("string returns value as string", () => {
    storage.set(KEY, -25.6);
    expect(storage.getAsString(KEY)).toBe("-25.6");
  });

  test("number returns value", () => {
    storage.set(KEY, -25.6);
    expect(storage.getAsNumber(KEY)).toBe(-25.6);
  });

  test("boolean returns undefined", () => {
    storage.set(KEY, -25.6);
    expect(storage.getAsBoolean(KEY)).toBe(undefined);
  });

  test("object returns undefined", () => {
    storage.set(KEY, -25.6);
    expect(storage.getAsObject(KEY)).toBe(undefined);
  });

  test("array returns undefined", () => {
    storage.set(KEY, -25.6);
    expect(storage.getAsArray(KEY)).toBe(undefined);
  });
});

describe("get value of type object as ", () => {
  const object = { test: "someValue" };
  test("any returns value as string", () => {
    storage.set(KEY, object);
    expect(storage.get(KEY)).toBe("{\"test\":\"someValue\"}");
  });

  test("string returns value as string", () => {
    storage.set(KEY, object);
    expect(storage.getAsString(KEY)).toBe("{\"test\":\"someValue\"}");
  });

  test("number returns undefined", () => {
    storage.set(KEY, object);
    expect(storage.getAsNumber(KEY)).toBe(undefined);
  });

  test("boolean returns undefined", () => {
    storage.set(KEY, object);
    expect(storage.getAsBoolean(KEY)).toBe(undefined);
  });

  test("object returns object", () => {
    storage.set(KEY, object);
    expect(storage.getAsObject(KEY)).toEqual(object);
  });

  test("array returns undefined", () => {
    storage.set(KEY, object);
    expect(storage.getAsArray(KEY)).toBe(undefined);
  });
});

describe("get value of type array as ", () => {
  const array = ["eins", "zwei"];
  test("any returns value as string", () => {
    storage.set(KEY, array);
    expect(storage.get(KEY)).toBe("[\"eins\",\"zwei\"]");
  });

  test("string returns value as string", () => {
    storage.set(KEY, array);
    expect(storage.getAsString(KEY)).toBe("[\"eins\",\"zwei\"]");
  });

  test("number returns undefined", () => {
    storage.set(KEY, array);
    expect(storage.getAsNumber(KEY)).toBe(undefined);
  });

  test("boolean returns undefined", () => {
    storage.set(KEY, array);
    expect(storage.getAsBoolean(KEY)).toBe(undefined);
  });

  test("object returns undefined", () => {
    storage.set(KEY, array);
    expect(storage.getAsObject(KEY)).toEqual(array);
  });

  test("array returns array", () => {
    storage.set(KEY, array);
    expect(storage.getAsArray(KEY)).toEqual(array);
  });
});

describe("get value of type boolean as ", () => {
  const value = true;
  test("any returns value as string", () => {
    storage.set(KEY, value);
    expect(storage.get(KEY)).toBe("true");
  });

  test("string returns value as string", () => {
    storage.set(KEY, false);
    expect(storage.getAsString(KEY)).toBe("false");
  });

  test("number returns undefined", () => {
    storage.set(KEY, value);
    expect(storage.getAsNumber(KEY)).toBe(undefined);
  });

  test("boolean returns boolean", () => {
    storage.set(KEY, value);
    expect(storage.getAsBoolean(KEY)).toBe(true);
  });

  test("object returns undefined", () => {
    storage.set(KEY, value);
    expect(storage.getAsObject(KEY)).toBe(undefined);
  });

  test("array returns undefined", () => {
    storage.set(KEY, value);
    expect(storage.getAsArray(KEY)).toBe(undefined);
  });
});

describe("get* of non existent key returns undefined", () => {
  test("get", () => {
    expect(storage.get(KEY)).toBe(undefined);
  });

  test("getAsString", () => {
    expect(storage.getAsString(KEY)).toBe(undefined);
  });

  test("getAsNumber", () => {
    expect(storage.getAsNumber(KEY)).toBe(undefined);
  });

  test("getAsBoolean", () => {
    expect(storage.getAsBoolean(KEY)).toBe(undefined);
  });

  test("getAsObject", () => {
    expect(storage.getAsObject(KEY)).toBe(undefined);
  });

  test("getAsArray", () => {
    expect(storage.getAsArray(KEY)).toBe(undefined);
  });
});

describe("HistoryMode is handled correctly", () => {
  test("REPLACE will not increase history length on set", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.REPLACE);
    const initialLength = history.length;
    store.set(KEY, "someValue");
    expect(history.length).toBe(initialLength);
  });

  test("PUSH will increase history length on set", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.PUSH);
    const initialLength = history.length;
    store.set(KEY, "someValue");
    expect(history.length).toBe(initialLength + 1);
  });

  test("REPLACE will not increase history length on remove", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.REPLACE);
    store.set(KEY, "someValue");
    const initialLength = history.length;
    store.del(KEY);
    expect(history.length).toBe(initialLength);
  });

  test("PUSH will increase history length on remove", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.PUSH);
    store.set(KEY, "someValue");
    const initialLength = history.length;
    store.del(KEY);
    expect(history.length).toBe(initialLength + 1);
  });
});
