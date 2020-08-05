import React, { useEffect, useState } from "react";
import { Dropdown, Menu } from "semantic-ui-react";
// css imports //
import "./css/storeItemsControlMenu.css";
// actions and state //
import { getAllStores } from "../../stores/actions/APIstoreActions";
import { AppAction, IGlobalAppState } from "../../../../state/Store";
// types and interfaces //
type DropdownData = {
  key: string;
  text: string;
  value: string;
}
interface Props {
  dispatch: React.Dispatch<AppAction>
  state: IGlobalAppState;
}
// components //
const StoreItemsControlMenu: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedStores : stores } = state.storeState;
  // local state //
  const [ dropdownLoading, setDropdownLoading ] = useState<boolean>(true);
  const [ dropdownData, setDropdownData ] = useState<DropdownData[]>();

  useEffect(() => {
    getAllStores(dispatch)
      .then((success) => {
        if (success) {
          setDropdownLoading(false);
        }
      })
  }, []);
  useEffect(() => {
    const updatedDropdownData = stores.map((store): DropdownData => {
      return {
        key: store._id,
        text: store.title,
        value: store.title
      };
    });
    setDropdownData(() => {
      return [
        ...updatedDropdownData
      ]
    })
  }, [stores])

  return (
    <Menu horizontal className="storeItemsControlsMenu">
      <Dropdown 
        item 
        text="Sort by Store Name"
        loading={dropdownLoading}
        options={dropdownData}
      />
      <Menu.Item fluid>
        <Dropdown text="Sort by Date">
          <Dropdown.Menu>
            <Dropdown.Item text="Descending" description="newest first" />
            <Dropdown.Item text="Ascending" description="oldest first" />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
      <Menu.Item fluid> 
        <Dropdown text="Sort By Price">
          <Dropdown.Menu>
            <Dropdown.Item text="Descending" description="expensive first" />
            <Dropdown.Item text="Ascending" descriptio="cheapest first" />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
      
    </Menu>
  );
}

export default StoreItemsControlMenu;