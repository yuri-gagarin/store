import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";

export const setCurrentProduct = (_id: string, dispatch: Dispatch<ProductAction>, state: IGlobalAppState): void => {
  const loadedPRoducts: IProductData[] = state.productState.loadedProducts;
  const newCurrentProduct: IProductData = loadedPRoducts.filter((product) => product._id === _id)[0];
  dispatch({ type: "SET_CURRENT_PRODUCT", payload: {
    currentProductData: newCurrentProduct
  }});
};

export const clearCurrentProduct = (dispatch: Dispatch<ProductAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_PRODUCT", payload: null });
};

export const openProductForm = (dispatch: Dispatch<ProductAction>): void => {
  dispatch({ type: "OPEN_PRODUCT_FORM", payload: { productFormOpen: true } });
};
export const closeProductForm = (dispatch: Dispatch<ProductAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_PRODUCT", payload: null });
  dispatch({ type: "CLOSE_PRODUCT_FORM", payload: { productFormOpen: false } });
};

