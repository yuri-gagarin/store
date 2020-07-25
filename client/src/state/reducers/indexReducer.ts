import combineReducers from "react-combine-reducers";
import bonusVideoReducer, { initialBonusVideoState } from "./bonusVideoReducer";
import productReducer, { initialProductState } from "./productReducer";
import storeReducer, { initialStoreState } from "./storeReducer";
import storeItemReducer, { initialStoreItemState } from "./storeItemReducer";
import serviceReducer, { initialServiceState } from "./serviceReducer";
import { IGlobalAppState, AppAction } from "../Store";

type CombinedReducer = (state: IGlobalAppState, action: AppAction) => IGlobalAppState;

export const [indexReducer, rootState ] = combineReducers<CombinedReducer>({
  bonusVideoState: [bonusVideoReducer, initialBonusVideoState],
  productState: [productReducer, initialProductState],
  storeState: [storeReducer, initialStoreState],
  storeItemState: [storeItemReducer, initialStoreItemState],
  serviceState: [serviceReducer, initialServiceState]
});