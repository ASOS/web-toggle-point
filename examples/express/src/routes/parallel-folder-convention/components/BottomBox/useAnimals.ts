import useAppSelector from "@/state/useAppSelector";
import slice from "@/state/modules/animals/slice";

const useAnimals = () => useAppSelector(slice.selectors.getAnimals);

export default useAnimals;
