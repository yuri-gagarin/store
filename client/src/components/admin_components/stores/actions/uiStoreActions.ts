import { Dispatch } from "react";
import { AppAction, IGlobalAppState } from "../../../../state/Store";
type StoreSearchData = {
  _id?: string;
  title?: string;
  newest?: boolean;
  oldest?: boolean;
}
export const setCurrentStore = (_id: string, dispatch: Dispatch<StoreAction>, state: IGlobalAppState): void => {
  const loadedStores = state.storeState.loadedStores;
  const newCurrentStore = loadedStores.filter((store) => store._id === _id)[0];
  dispatch({ type: "SET_CURRENT_STORE", payload: {
    currentStoreData: newCurrentStore
  }});
};

export const setStoreByOptions = (optionsObject: StoreSearchData, dispatch: Dispatch<StoreAction>, state: IGlobalAppState): void => {
  const { _id, title, newest, oldest } = optionsObject;
  let newCurrenstStore: IStoreData | undefined = undefined;
  const loadedStores = state.storeState.loadedStores;
  if (title) {
    newCurrenstStore = loadedStores.filter((store) => store.title === title)[0];
  } else if (newest) {
    // sort by newest and return newest //
  } else if (oldest) {
    // sort by oldest and return oldest //
  }
  dispatch({ type: "SET_CURRENT_STORE", payload: {
    currentStoreData: newCurrenstStore ? newCurrenstStore : state.storeState.currentStoreData
  }})
}

export const clearCurrentStore = (dispatch: Dispatch<StoreAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_STORE", payload: null });
};
