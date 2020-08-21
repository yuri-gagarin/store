import React, {  useEffect, useState } from "react";
import { Dropdown, DropdownProps } from "semantic-ui-react";
// actions and state //
import { getAllStores } from "../../stores/actions/APIstoreActions";
import { setStoreByOptions } from "../../stores/actions/uiStoreActions";
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
  const [ disabled, setDisabled ] = useState<boolean>(true);
  const { loadedStores } = state.storeState;

  const handleSearchChange = (e: React.SyntheticEvent, data: DropdownProps): void => {
    setStoreByOptions({ title: data.value as string }, dispatch, state);
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
    });
    if (loadedStores.length > 0) {
      setDisabled(false);
    }
  }, [loadedStores]);

  return (
    <Dropdown
      placeholder={"Select a Store"}
      selection
      onChange={handleSearchChange}
      options={dropdownState}
      disabled={disabled}
    />
  )
};

export default StoreNameDropDown;