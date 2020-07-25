import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";

export const setCurrentStoreItem = (_id: string, dispatch: Dispatch<StoreItemAction>, state: IGlobalAppState): void => {
  const loadedPRoducts: IStoreItemData[] = state.storeItemState.loadedStoreItems;
  const newCurrentStoreItem: IStoreItemData = loadedPRoducts.filter((storeItem) => storeItem._id === _id)[0];
  dispatch({ type: "SET_CURRENT_STORE_ITEM", payload: {
    currentStoreItemData: newCurrentStoreItem
  }});
};

export const clearCurrentStoreItem = (dispatch: Dispatch<StoreItemAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_STORE_ITEM", payload: null });
};
