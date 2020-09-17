import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";

export const setCurrentStoreItem = (_id: string, dispatch: Dispatch<StoreItemAction>, state: IGlobalAppState): void => {
  const loadedPRoducts: IStoreItemData[] = state.storeItemState.loadedStoreItems;
  const newCurrentStoreItem: IStoreItemData = loadedPRoducts.filter((storeItem) => storeItem._id === _id)[0];
  dispatch({ type: "SET_CURRENT_STORE_ITEM", payload: {
    currentStoreItemData: newCurrentStoreItem,
    error: null
  }});
};

export const clearCurrentStoreItem = (dispatch: Dispatch<StoreItemAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_STORE_ITEM", payload: { error: null } });
};

export const openStoreItemForm = (dispatch: Dispatch<StoreItemAction>): void => {
  console.log("called open form action")
  dispatch({ type: "OPEN_STORE_ITEM_FORM", payload: { storeItemFormOpen: true } });
};
export const closeStoreItemForm = (dispatch: Dispatch<StoreItemAction>): void => {
  dispatch({ type: "CLOSE_STORE_ITEM_FORM", payload: { storeItemFormOpen: false } });
};

