import combineReducers from "react-combine-reducers";
import storeReducer, { initialStoreState } from "./storeReducer";

export const [indexReducer, rootState] = combineReducers({
  storeState: [storeReducer, initialStoreState]
});