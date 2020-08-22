import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";

export const setCurrentService = (_id: string, dispatch: Dispatch<ServiceAction>, state: IGlobalAppState): void => {
  const loadedServices = state.serviceState.loadedServices;
  const newCurrentService = loadedServices.filter((service) => service._id === _id)[0];
  dispatch({ type: "SET_CURRENT_SERVICE", payload: {
    currentServiceData: newCurrentService
  }});
};

export const clearCurrentService = (dispatch: Dispatch<ServiceAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_SERVICE", payload: null });
};
