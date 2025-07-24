import { nodeRequestScopedStoreFactory as featuresStoreFactory } from "@asos/web-toggle-point-features";

const featuresStore = featuresStoreFactory({ toggleType: "api version" });

export default featuresStore;
