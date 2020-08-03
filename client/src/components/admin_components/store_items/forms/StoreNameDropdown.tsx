import React, { useContext, useEffect, useState } from "react";
import { Dropdown, DropdownProps } from "semantic-ui-react";
// actions and state //
import { getAllStores } from "../../stores/actions/APIstoreActions";
import { getAllStoreItems } from "../actions/APIStoreItemActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// helpers //
import { capitalizeString } from "../../../helpers/displayHelpers";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
type DropdownData = {
  key: string;
  text: string;
  value: string;
}
const StoreNameDropDown: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const [ dropdownState, setDropdownState ] = useState<DropdownData[]>();
  const { loadedStores } = state.storeState;

  const handleSearchChange = (e: React.SyntheticEvent, data: DropdownProps): void => {
    const queryOptions = {
      storeName: data.value as string
    }
    getAllStoreItems(dispatch, queryOptions);
  }
  // lifecycle methods //
  useEffect(() => {
    getAllStores(dispatch);
  }, []);

  useEffect(() => {
    const dropdownData = loadedStores.map((store) => {
      return {
        key: store._id,
        text: capitalizeString(store.title),
        value: store.title
      }
    });
    setDropdownState(() => {
      return [ ...dropdownData ];
    })
  }, [loadedStores]);

  return (
    <Dropdown
      placeholder={"Filter by Store name"}
      selection
      onChange={handleSearchChange}
      options={dropdownState}
    />
  )
};

export default StoreNameDropDown;