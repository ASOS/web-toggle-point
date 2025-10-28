import slice from "@/state/modules/animals/slice";
import useAppDispatch from "@/state/useAppDispatch";
import constants from "@/constants/index";

const useAddAnimal = () => {
  const action = slice.actions.add(constants.ANIMAL);
  const dispatch = useAppDispatch();
  return () => dispatch(action);
};

export default useAddAnimal;
