import requestScopedStoreFactory from "./store";
import { AsyncLocalStorage } from "async_hooks";

jest.mock("async_hooks", () => ({
  AsyncLocalStorage: jest.fn(() => ({
    run: jest.fn(),
    getStore: jest.fn()
  }))
}));

describe("nodeRequestScopedFeaturesStoreFactory", () => {
  const toggleType = "test-toggle-type";
  let requestScopedStore;

  beforeEach(() => {
    requestScopedStore = requestScopedStoreFactory({ toggleType });
  });

  it("should create an AsyncLocalStorage store", () => {
    expect(AsyncLocalStorage).toHaveBeenCalled();
  });

  describe("when getting a value outside the scope of a request", () => {
    it("should throw an error", () => {
      expect(() => requestScopedStore.getFeatures()).toThrow(
        "Called outside of request context"
      );
    });
  });

  describe("when using a value", () => {
    const value = Symbol("test-value");
    const scopeCallBack = Symbol("test-callback");
    let storeMock;

    beforeEach(() => {
      requestScopedStore.useValue({ value, scopeCallBack });
      storeMock = AsyncLocalStorage.mock.results[0].value;
    });

    it("should scope the value to the descendants of the callback, by running it in the local storage", () => {
      expect(storeMock.run).toHaveBeenCalledWith(value, scopeCallBack);
    });

    describe("when getting the features", () => {
      const returnedValue = Symbol("test-value");
      beforeEach(() => {
        AsyncLocalStorage.mock.results[0].value.getStore.mockReturnValue(
          returnedValue
        );
      });

      it("should return the value scoped to the current request", () => {
        expect(requestScopedStore.getFeatures()).toEqual(returnedValue);
      });
    });
  });

  describe("when creating a new store with the same toggleType", () => {
    let newRequestScopedStore;
    beforeEach(() => {
      newRequestScopedStore = requestScopedStoreFactory({ toggleType });
    });

    it("should return the same store instance", () => {
      expect(newRequestScopedStore).toBe(requestScopedStore);
    });
  });

  describe("when creating a new store with a different toggleType", () => {
    let newRequestScopedStore;
    const newToggleType = "new-test-toggle-type";
    beforeEach(() => {
      newRequestScopedStore = requestScopedStoreFactory({
        toggleType: newToggleType
      });
    });

    it("should return a different store instance", () => {
      expect(newRequestScopedStore).not.toBe(requestScopedStore);
    });
  });
});
