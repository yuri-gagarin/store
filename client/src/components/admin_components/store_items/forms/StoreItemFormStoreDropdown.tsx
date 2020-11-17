import React, {  useEffect, useState, useContext } from "react";
import { Dropdown, DropdownProps } from "semantic-ui-react";
// helpers //
import { capitalizeString } from "../../../helpers/displayHelpers";
// types //
import { StoreDropdownData, StoreItemFormStoreDropdownData, StoreItemFormStoreDropdownState } from "../type_definitions/storeItemTypes";

interface Props {
  activeStores: StoreDropdownData[];
  setStoreItemStore: (data: StoreDropdownData) => void;
}

const StoreItemFormStoreDropdown: React.FC<Props> = ({ activeStores, setStoreItemStore }): JSX.Element => {

  const [ dropdownState, setDropdownState ] = useState<StoreItemFormStoreDropdownState>({ disabled: true, dropdownData: []});

  const handleSearchChange = (e: React.SyntheticEvent, data: DropdownProps): void => {
    const storeName = data.value as string;
    const selectedStore: StoreItemFormStoreDropdownData = dropdownState.dropdownData.filter((stores) => {
      return stores.value === storeName;
    })[0];
    setStoreItemStore({ storeName: selectedStore.value, storeId: selectedStore.key });
  }
  
  useEffect(() => {
    if (activeStores.length > 0) {
      const dropdownData: StoreItemFormStoreDropdownData[] = activeStores.map((store) => {
        return {
          key: store.storeId,
          text: capitalizeString(store.storeName),
          value: store.storeName
        }
      });
      setDropdownState({
        disabled: false,
        dropdownData: dropdownData
      });
    } else {
      setDropdownState({
        disabled: true,
        dropdownData: []
      });
    }
  }, [ activeStores ]);

  return (
    <Dropdown
      placeholder={"Select a Store"}
      selection
      onChange={handleSearchChange}
      options={dropdownState.dropdownData}
      disabled={dropdownState.disabled}
    />
  )
};

export default StoreItemFormStoreDropdown;