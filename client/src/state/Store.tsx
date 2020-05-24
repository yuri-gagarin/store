import React, { createContext, useReducer, useEffect } from "react";
import { indexReducer, rootState } from "./reducers/indexReducer";
import { initialStoreState } from "./reducers/storeReducer";
// global app state //
export type IGlobalAppState = {
  [storeState : string]: IStoreState;
}
// app actions //
export type AppAction = StoreAction;
// global app context //
export interface IGlobalAppContext {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
// context initialization //
const initialContext: IGlobalAppContext = {
  state: {
    storeState: { ...initialStoreState }
  },
  dispatch: (value: AppAction): void => {}
} 
export const Store = createContext<IGlobalAppContext>(initialContext);

const logStateChanges = (state: IGlobalAppState): void => {
  console.log("state changed");
  for (const key in state) {
    console.log(state[key]);
  }
}
export const StateProvider: React.FC<{}> = ({ children }): JSX.Element => {
  const [ globalState, dispatch ] = useReducer(indexReducer, rootState);
  useEffect(() => {
    logStateChanges(globalState);
  }, [globalState])
  return  (
    <Store.Provider value={{ state: globalState, dispatch: dispatch }}>
      {children}
    </Store.Provider>
  );
};

