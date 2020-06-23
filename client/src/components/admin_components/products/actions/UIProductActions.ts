import { Dispatch } from "react";
import { AppAction, IGlobalAppState } from "../../../../state/Store";

export const setCurrentProduct = (_id: string, dispatch: Dispatch<AppAction>, state: IGlobalAppState): void => {
  const loadedPRoducts: IProductData[] = state.productState.loadedProducts;
  const newCurrentProduct: IProductData = loadedPRoducts.filter((product) => product._id === _id)[0];
  dispatch({ type: "SET_CURRENT_PRODUCT", payload: {
    currentProductData: newCurrentProduct
  }});
};

export const clearCurrentProduct = (dispatch: Dispatch<AppAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_PRODUCT", payload: null });
};
