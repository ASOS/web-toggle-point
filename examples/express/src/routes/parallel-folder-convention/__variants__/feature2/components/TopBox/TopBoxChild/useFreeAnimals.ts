import slice from "@/state/modules/animals/slice";
import useAppDispatch from "@/state/useAppDispatch";
import type { UnknownAction } from "@reduxjs/toolkit";

const useFreeAnimals = () => {
  const dispatch = useAppDispatch();
  return () => {
    const action = (
      slice.actions as typeof slice.actions & { freedom: () => UnknownAction }
    ).freedom();
    dispatch(action);
  };
};

export default useFreeAnimals;
