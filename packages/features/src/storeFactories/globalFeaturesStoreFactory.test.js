import globalFeaturesStoreFactory from "./globalFeaturesStoreFactory";

describe("globalFeaturesStoreFactory", () => {
  let featuresStoreFactory;

  beforeEach(() => {
    featuresStoreFactory = globalFeaturesStoreFactory();
  });

  describe("when setting a value", () => {
    const value = Symbol("test-value");

    beforeEach(() => {
      featuresStoreFactory.setValue({ value });
    });

    it("should store the value for later retrieval", () => {
      expect(featuresStoreFactory.getFeatures()).toBe(value);
    });

    describe("when setting a different value", () => {
      const differentValue = Symbol("different-value");

      beforeEach(() => {
        featuresStoreFactory.setValue({ value: differentValue });
      });

      it("should store the new value for later retrieval", () => {
        expect(featuresStoreFactory.getFeatures()).toBe(differentValue);
      });
    });

    describe("when constructing a new store", () => {
      let newFeaturesStoreFactory;

      beforeEach(() => {
        newFeaturesStoreFactory = globalFeaturesStoreFactory();
      });

      it("should not share the value with the new store", () => {
        expect(newFeaturesStoreFactory.getFeatures()).toBeUndefined();
      });

      it("should still have the original value in the first store", () => {
        expect(featuresStoreFactory.getFeatures()).toBe(value);
      });
    });
  });
});
