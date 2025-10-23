import { withTogglePointFactory } from "@asos/web-toggle-point-react-pointcuts";
import { useFeatures as getActiveFeatures } from "../featuresStore";

const togglePoint = withTogglePointFactory({
  getActiveFeatures,
  variantKey: "selection"
});

export default togglePoint;
