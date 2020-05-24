import { Dispatch } from "react";
import { AppAction, IGlobalAppState } from "../../../../state/Store";

export const setCurrentStore = (_id: string, dispatch: Dispatch<AppAction>, state: IGlobalAppState): void => {
  const loadedStores = state.storeState.loadedStores;
  const newCurrentStore = loadedStores.filter((store) => store._id === _id)[0];
  dispatch({ type: "SET_CURRENT_STORE", payload: {
    currentStoreData: newCurrentStore
  }});
};

export const clearCurrentStore = (dispatch: Dispatch<AppAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_STORE", payload: null });
};
