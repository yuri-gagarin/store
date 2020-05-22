import { createContext } from "react";

const initialState = {};
const Store = createContext(initialState);

const StateProvider: React.FC<{}> = ({ children }): JSX.Element => {
  return  (
    <Store.Provider>

    </Store.Provider>
  );
};

export default StateProvider;