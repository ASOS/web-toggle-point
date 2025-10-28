let getFeatures, setValue, useFeatures;

if (CLIENT) {
  ({ getFeatures, setValue, useFeatures } = require("./browser.ts"));
} else {
  ({ getFeatures, setValue, useFeatures } = require("./server.ts"));
}

export { getFeatures, setValue, useFeatures };
