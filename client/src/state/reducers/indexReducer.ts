import combineReducers from "react-combine-reducers";
import productReducer, { initialProductState } from "./productReducer";
import storeReducer, { initialStoreState } from "./storeReducer";
import serviceReducer, { initialServiceState } from "./serviceReducer";
import { IGlobalAppState, AppAction } from "../Store";

type CombinedReducer = (state: IGlobalAppState, action: AppAction) => IGlobalAppState;

export const [indexReducer, rootState ] = combineReducers<CombinedReducer>({
  productState: [productReducer, initialProductState],
  storeState: [storeReducer, initialStoreState],
  serviceState: [serviceReducer, initialServiceState]
});