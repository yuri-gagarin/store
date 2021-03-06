import React, { createContext, useReducer, useEffect, useRef } from "react";
import { indexReducer, rootState } from "./reducers/indexReducer";
import { initialBonusVideoState } from "./reducers/bonusVideoReducer";
import { initialProductState } from "./reducers/productReducer";
import { initialStoreState } from "./reducers/storeReducer";
import {initialStoreItemState } from "./reducers/storeItemReducer";
import { initialServiceState } from "./reducers/serviceReducer";
// global app state //
export interface IGlobalAppState {
  bonusVideoState: IBonusVideoState;
  productState: IProductState;
  storeState: IStoreState;
  storeItemState: IStoreItemState;
  serviceState: IServiceState;
}
// app actions //
export type AppAction = StoreAction | StoreItemAction | ServiceAction  | ProductAction | BonusVideoAction;
// global app context //
export interface IGlobalAppContext {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
// context initialization //
export const initialContext: IGlobalAppContext = {
  state: {
    bonusVideoState: { ...initialBonusVideoState },
    productState: { ...initialProductState },
    storeState: { ...initialStoreState },
    storeItemState: { ...initialStoreItemState },
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

  if (process.env.NODE_ENV === "development") {
    usePrevious(globalState);
  }


  return  (
    <Store.Provider value={{ state: globalState, dispatch: dispatch }}>
      {children}
    </Store.Provider>
  );
};

type TestStateProviderProps = {
  mockState?: IGlobalAppState
}
export const TestStateProvider: React.FC<TestStateProviderProps> = ({ mockState, children }): JSX.Element => {
  let testState = mockState ? mockState : rootState
  const [ state, dispatch ] = useReducer(indexReducer, testState);
  return  (
    <Store.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </Store.Provider>
  );
};

