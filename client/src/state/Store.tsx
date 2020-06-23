import React, { createContext, useReducer, useEffect, useRef } from "react";
import { indexReducer, rootState } from "./reducers/indexReducer";
import { initialProductState } from "./reducers/productReducer";
import { initialStoreState } from "./reducers/storeReducer";
import { initialServiceState } from "./reducers/serviceReducer";
// global app state //
export interface IGlobalAppState {
  productState: IProductState;
  storeState: IStoreState;
  serviceState: IServiceState;
}
// app actions //
export type AppAction = StoreAction | ServiceAction | ProductAction;
// global app context //
export interface IGlobalAppContext {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
// context initialization //
const initialContext: IGlobalAppContext = {
  state: {
    productState: { ...initialProductState },
    storeState: { ...initialStoreState },
    serviceState: { ...initialServiceState }
  },
  dispatch: (value: AppAction): void => {}
} 
export const Store = createContext<IGlobalAppContext>(initialContext);

/*
const logStateChanges = (state: IGlobalAppState): void => {
  console.log("state changed");
  for (const key of Object.keys(state)) {
    const val = state[key];
    
  }
}
*/

export const StateProvider: React.FC<{}> = ({ children }): JSX.Element => {
  const [ globalState, dispatch ] = useReducer(indexReducer, rootState);

  const usePrevious = (state: IGlobalAppState) => {
    const ref = useRef<IGlobalAppState>();
    useEffect(() => {
      ref.current = state;
      console.log("Previous State");
      console.log(ref.current);
      console.log("Current State");
      console.log(state);
    }, [state])
   
  };

  usePrevious(globalState)

  return  (
    <Store.Provider value={{ state: globalState, dispatch: dispatch }}>
      {children}
    </Store.Provider>
  );
};

