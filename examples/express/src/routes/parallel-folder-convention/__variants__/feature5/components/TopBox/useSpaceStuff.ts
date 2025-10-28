import useAppSelector from "@/state/useAppSelector";
import slice from "../../state/modules/space/slice";

const useSpaceStuff = () =>
  useAppSelector(slice.selectors.getSpaceStuff as any);

export default useSpaceStuff;
