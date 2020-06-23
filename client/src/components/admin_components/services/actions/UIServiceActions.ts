import { Dispatch } from "react";
import { AppAction, IGlobalAppState } from "../../../../state/Store";

export const setCurrentService = (_id: string, dispatch: Dispatch<AppAction>, state: IGlobalAppState): void => {
  const loadedServices = state.serviceState.loadedServices;
  const newCurrentService = loadedServices.filter((service) => service._id === _id)[0];
  dispatch({ type: "SET_CURRENT_SERVICE", payload: {
    currentServiceData: newCurrentService
  }});
};

export const clearCurrentService = (dispatch: Dispatch<AppAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_SERVICE", payload: null });
};
