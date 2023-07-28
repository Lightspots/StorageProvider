import "jest";
import { Storage, StorageProvider } from "../src";

let storage: Storage;

const KEY = "abc";

beforeEach(() => {
  sessionStorage.clear();
  jest.clearAllMocks();
  storage = StorageProvider.sessionStorage("test");
});

describe("key concatenation works correctly", () => {
  test("on get", () => {
    storage.get(KEY);
    expect(sessionStorage.getItem).toHaveBeenLastCalledWith("test_abc");
  });
  test("on set", () => {
    storage.set(KEY, "someValue");
    expect(sessionStorage.setItem).toHaveBeenLastCalledWith(
      "test_abc",
      "someValue",
    );
  });
  test("on del", () => {
    storage.del(KEY);
    expect(sessionStorage.removeItem).toHaveBeenLastCalledWith("test_abc");
  });
  test("on del multiple", () => {
    storage.del([KEY, "efg"]);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith("test_abc");
    expect(sessionStorage.removeItem).toHaveBeenLastCalledWith("test_efg");
  });
});

describe("set does correctly serialize values of type", () => {
  test("string", () => {
    storage.set(KEY, "someValue");
    expect(sessionStorage.__STORE__["test_" + KEY]).toBe("someValue");
  });

  test("boolean", () => {
    storage.set(KEY, false);
    expect(sessionStorage.__STORE__["test_" + KEY]).toBe("false");
  });

  test("number", () => {
    storage.set(KEY, -524.6);
    expect(sessionStorage.__STORE__["test_" + KEY]).toBe("-524.6");
  });

  test("object", () => {
    storage.set(KEY, { name: "Jane Doe" });
    expect(sessionStorage.__STORE__["test_" + KEY]).toBe('{"name":"Jane Doe"}');
  });

  test("array", () => {
    storage.set(KEY, ["eins", "zwei"]);
    expect(sessionStorage.__STORE__["test_" + KEY]).toBe('["eins","zwei"]');
  });

  test("multiple types in one call", () => {
    storage.set({
      str: "someString",
      bool: true,
      obj: {
        val: "innerValue",
      },
    });
    expect(sessionStorage.__STORE__.test_str).toBe("someString");
    expect(sessionStorage.__STORE__.test_bool).toBe("true");
    expect(sessionStorage.__STORE__.test_obj).toBe('{"val":"innerValue"}');
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

  test("zero returns zero", () => {
    storage.set(KEY, 0);
    expect(storage.getAsNumber(KEY)).toBe(0);
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
    const rootStorage = StorageProvider.sessionStorage();
    rootStorage.set("other_key", "otherVal");

    expect(storage.isEmpty()).toBe(true);
    expect(rootStorage.isEmpty()).toBe(false);
  });
  test("size only considers only keys with matching prefix", () => {
    const rootStorage = StorageProvider.sessionStorage();
    storage.set("some_key", "Value");
    rootStorage.set("other_key", "otherVal");

    expect(storage.size()).toBe(1);
    expect(rootStorage.size()).toBe(2);
  });
});
