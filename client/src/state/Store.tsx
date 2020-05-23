import React, { createContext, useReducer } from "react";
import { indexReducer, rootState } from "./reducers/indexReducer";
import { initialStoreState, StoreAction, IStoreState } from "./reducers/storeReducer";
// global app state //
export type IGlobalAppState = {
  storeState: IStoreState;
}
// app actions //
export type AppAction = StoreAction;
// global app context //
export interface IGlobalAppContext {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
export type CombinedReducer = (state: IGlobalAppState, action: AppAction) => IGlobalAppState;
// context initialization //
const initialContext: IGlobalAppContext = {
  state: {
    storeState: { ...initialStoreState }
  },
  dispatch: (value: AppAction): void => {}
} 
const Store = createContext<IGlobalAppContext>(initialContext);

export const StateProvider: React.FC<{}> = ({ children }): JSX.Element => {
  const [ globalState, dispatch ] = useReducer<CombinedReducer>(indexReducer, rootState as IGlobalAppState);
  return  (
    <Store.Provider value={{ state: globalState, dispatch: dispatch }}>
      {children}
    </Store.Provider>
  );
};

