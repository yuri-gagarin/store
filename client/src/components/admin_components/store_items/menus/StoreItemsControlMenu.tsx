import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItemProps, Menu } from "semantic-ui-react";
// css imports //
import "./css/storeItemsControlMenu.css";
// actions and state //
import { getAllStores } from "../../stores/actions/APIstoreActions";
import { getAllStoreItems } from "../actions/APIStoreItemActions";
import { AppAction, IGlobalAppState } from "../../../../state/Store";
// types and interfaces //
import { StoreItemQueryPar } from "../custom_types/customTypes";
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
  const [ storeItemQuery, setStoreItemQuery ] = useState<StoreItemQueryPar>();
  const [ dropdownData, setDropdownData ] = useState<DropdownData[]>();
  // dropdown handlers //
  const handleDateSortClick = (e: React.MouseEvent, data: DropdownItemProps): void => {
    const queryOption = data.value as string;
    setStoreItemQuery({ ...storeItemQuery, date: queryOption });
  };
  const handlePriceSortClick = (e: React.MouseEvent, data: DropdownItemProps): void => {
    const queryOption = data.value as string;
    setStoreItemQuery({ ...storeItemQuery, price: queryOption });
  };
  const handleNameSortClick = (e: React.MouseEvent, data: DropdownItemProps): void => {
    const queryOption = data.value as string;
    setStoreItemQuery({ ...storeItemQuery, price: queryOption });
  };
  // lifecycle hooks //
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
  useEffect(() => {
    getAllStoreItems(dispatch, storeItemQuery)
  }, [storeItemQuery]);

  return (
    <div>
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
            <Dropdown.Item 
              text="Descending" 
              description="newest first" 
              value="desc"
              onClick={handleDateSortClick}
            />
            <Dropdown.Item 
              text="Ascending" 
              description="oldest first" 
              value="asc"
              onClick={handleDateSortClick}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
      <Menu.Item fluid> 
        <Dropdown text="Sort By Price">
          <Dropdown.Menu>
            <Dropdown.Item 
              text="Descending" 
              description="expensive first" 
              value="desc"
              onClick={handlePriceSortClick}
            />
            <Dropdown.Item 
              text="Ascending" 
              description="cheapest first" 
              value="asc"
              onClick={handlePriceSortClick}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
      
    </Menu>
    <Menu id="storeItemsControlsSecondMenu">
      <Menu.Item fluid>
        <Dropdown text="Sort by name">
          <Dropdown.Menu>
            <Dropdown.Item 
              text="Descending" 
              description="Z - A" 
              value="desc"
              onClick={handlePriceSortClick}
            />
            <Dropdown.Item 
              text="Ascending" 
              description="A - Z" 
              value="asc"
              onClick={handlePriceSortClick}
            />
          </Dropdown.Menu>

        </Dropdown>
        
      </Menu.Item>
      <Menu.Item fluid>
        <Dropdown text="Sort by category">
          <Dropdown.Menu>
            <Dropdown.Item 
              text="Descending" 
              description="Z - A" 
              value="desc"
              onClick={handlePriceSortClick}
            />
            <Dropdown.Item 
              text="Ascending" 
              description="A - Z" 
              value="asc"
              onClick={handlePriceSortClick}
            />
          </Dropdown.Menu>

        </Dropdown>
        
      </Menu.Item>
    </Menu>

    </div>
  );
}

export default StoreItemsControlMenu;