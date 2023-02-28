import { useSelector, TypedUseSelectorHook } from "react-redux";
import { IState } from "../redux/store";

export const useAppSelector: TypedUseSelectorHook<IState> = useSelector;
