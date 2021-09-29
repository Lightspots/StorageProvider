import "jest";
import { HistoryMode, Storage, StorageProvider } from "../src";

let storage: Storage;

const KEY = "abc";

function url(hash = "") {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const path = window.location.pathname;
  return `${protocol}//${host}${path}${hash}`;
}

beforeEach(() => {
  storage = StorageProvider.urlStorage("test");
  history.replaceState(null, "", url());
});

function expectKeyValue(key: string, value: string) {
  expect(window.location.search.substring(1)).toEqual(key + "=" + value);
}

describe("key concatenation works correctly", () => {
  test("on get", () => {
    history.replaceState(
      null,
      "",
      `${url()}?test_abc=someValue&test_efg=otherValue`
    );
    expect(storage.get(KEY)).toEqual("someValue");
  });
  test("on set", () => {
    storage.set(KEY, "someValue");
    expectKeyValue("test_" + KEY, "someValue");
  });
  test("on del", () => {
    history.replaceState(
      null,
      "",
      `${url()}?test_abc=someValue&test_efg=otherValue`
    );
    storage.del(KEY);
    expect(window.location.search).toEqual("?test_efg=otherValue");
  });
  test("on del multiple", () => {
    history.replaceState(
      null,
      "",
      `${url()}?test_abc=someValue&test_efg=otherValue`
    );
    storage.del([KEY, "efg"]);
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

  test("multiple types in one call", () => {
    storage.set({
      str: "someString",
      bool: true,
      obj: {
        val: "innerValue",
      },
    });
    const keyValues = window.location.search.substring(1).split("&");
    expect(keyValues).toContain("test_str=someString");
    expect(keyValues).toContain("test_bool=true");
    expect(keyValues).toContain("test_obj=%7B%22val%22%3A%22innerValue%22%7D");
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
    expect(storage.getAsRecord(KEY)).toBe(undefined);
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
    expect(storage.getAsRecord(KEY)).toBe(undefined);
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
    expect(storage.get(KEY)).toBe('{"test":"someValue"}');
  });

  test("string returns value as string", () => {
    storage.set(KEY, object);
    expect(storage.getAsString(KEY)).toBe('{"test":"someValue"}');
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
    expect(storage.getAsRecord(KEY)).toEqual(object);
  });

  test("array returns undefined", () => {
    storage.set(KEY, object);
    expect(storage.getAsArray(KEY)).toBe(undefined);
  });
});

describe("get value as Object", () => {
  interface TestObj extends Record<string, unknown> {
    field: string;
    age: number;
    optional?: string;
  }
  const validObject: TestObj = {
    field: "foo",
    age: 23,
  };
  const invalidObject = {
    age: 24,
    optional: "someString",
  };

  test("valid object returns valid object", () => {
    storage.set(KEY, validObject);
    expect(storage.getAsObject<TestObj>(KEY)).toEqual(validObject);
  });

  test("invalid object returns invalid object, without type check", () => {
    storage.set(KEY, invalidObject);
    expect(storage.getAsObject<TestObj>(KEY)).toEqual(invalidObject);
  });

  test("invalid object returns undefined, with type check", () => {
    const check = (o: Record<string, unknown>): o is TestObj => {
      return o.field !== undefined && o.age !== undefined;
    };

    storage.set(KEY, invalidObject);
    expect(storage.getAsObject<TestObj>(KEY, check)).toEqual(undefined);
  });
});

describe("get value of type array as ", () => {
  const array = ["eins", "zwei"];
  test("any returns value as string", () => {
    storage.set(KEY, array);
    expect(storage.get(KEY)).toBe('["eins","zwei"]');
  });

  test("string returns value as string", () => {
    storage.set(KEY, array);
    expect(storage.getAsString(KEY)).toBe('["eins","zwei"]');
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
    expect(storage.getAsRecord(KEY)).toEqual(array);
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
    expect(storage.getAsRecord(KEY)).toBe(undefined);
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

  test("getAsRecord", () => {
    expect(storage.getAsRecord(KEY)).toBe(undefined);
  });

  test("getAsArray", () => {
    expect(storage.getAsArray(KEY)).toBe(undefined);
  });
});

describe("HistoryMode is handled correctly", () => {
  test("REPLACE will not increment history length on set", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.REPLACE);
    const initialLength = history.length;
    store.set(KEY, "someValue");
    expect(history.length).toBe(initialLength);
  });

  test("PUSH will increment history length on set", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.PUSH);
    const initialLength = history.length;
    store.set(KEY, "someValue");
    expect(history.length).toBe(initialLength + 1);
  });

  test("REPLACE will not increment history length on remove", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.REPLACE);
    store.set(KEY, "someValue");
    const initialLength = history.length;
    store.del(KEY);
    expect(history.length).toBe(initialLength);
  });

  test("PUSH will increment history length on remove", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.PUSH);
    store.set(KEY, "someValue");
    const initialLength = history.length;
    store.del(KEY);
    expect(history.length).toBe(initialLength + 1);
  });

  test("PUSH will increment history length when set multiple", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.PUSH);
    const initialLength = history.length;
    store.set({
      str: "someString",
      bool: true,
      obj: {
        val: "innerValue",
      },
    });
    expect(history.length).toBe(initialLength + 1);
  });

  test("PUSH will increment history length when del multiple", () => {
    const store = StorageProvider.urlStorage("", HistoryMode.PUSH);
    store.set({
      str: "someString",
      bool: true,
      obj: {
        val: "innerValue",
      },
    });
    const initialLength = history.length;
    store.del(["str", "bool", "obj"]);
    expect(history.length).toBe(initialLength + 1);
  });
});

describe("Url is builded correctly", () => {
  test("hash is not removed in push mode", () => {
    history.replaceState(null, "", url("#fooBar"));
    const store = StorageProvider.urlStorage("", HistoryMode.PUSH);
    store.set("key", "value");
    expect(location.href).toBe(
      `${location.protocol}//${location.host}${location.pathname}?key=value#fooBar`
    );
  });
  test("hash is not removed in replace mode", () => {
    history.replaceState(null, "", url("#fooBar"));
    const store = StorageProvider.urlStorage("", HistoryMode.REPLACE);
    store.set("key", "value");
    expect(location.href).toBe(
      `${location.protocol}//${location.host}${location.pathname}?key=value#fooBar`
    );
  });
  test("plus is encoded as %2B and spaces as %20", () => {
    storage.set("a key+val", "a value+key");
    expectKeyValue("test_a%20key%2Bval", "a%20value%2Bkey");
  });
  test("plus is decoded as space", () => {
    history.replaceState(
      null,
      "",
      `${url()}?test_a%20key%2Bval+plus=a%20value%2Bkey+plus`
    );
    expect(storage.get("a key+val plus")).toBe("a value+key plus");
  });
});

describe("size and isEmpty works returns correct values", () => {
  test("empty store returns empty", () => {
    expect(storage.isEmpty()).toBe(true);
  });
  test("empty store size is zero", () => {
    expect(storage.size()).toBe(0);
  });
  test("non empty store returns non empty", () => {
    storage.set("some_key", "Value");
    expect(storage.isEmpty()).toBe(false);
  });
  test("isEmpty only considers only keys with matching prefix", () => {
    const rootStorage = StorageProvider.urlStorage();
    rootStorage.set("other_key", "otherVal");

    expect(storage.isEmpty()).toBe(true);
    expect(rootStorage.isEmpty()).toBe(false);
  });
  test("size only considers only keys with matching prefix", () => {
    const rootStorage = StorageProvider.urlStorage();
    storage.set("some_key", "Value");
    rootStorage.set("other_key", "otherVal");

    expect(storage.size()).toBe(1);
    expect(rootStorage.size()).toBe(2);
  });
});
