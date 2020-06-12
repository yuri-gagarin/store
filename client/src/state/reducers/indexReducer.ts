import combineReducers from "react-combine-reducers";
import storeReducer, { initialStoreState } from "./storeReducer";
import serviceReducer, { initialServiceState } from "./serviceReducer";
import { IGlobalAppState, AppAction } from "../Store";

type CombinedReducer = (state: IGlobalAppState, action: AppAction) => IGlobalAppState;

export const [indexReducer, rootState ] = combineReducers<CombinedReducer>({
  storeState: [storeReducer, initialStoreState],
  serviceState: [serviceReducer, initialServiceState]
});