import React, { useEffect, useRef, useState } from "react";
import { Dropdown, DropdownItemProps, Menu } from "semantic-ui-react";
// css imports //
import "./css/storeItemsControlMenu.css";
// actions and state //
import { getAllStores } from "../../stores/actions/APIstoreActions";
import { getAllStoreItems } from "../actions/APIStoreItemActions";
import { AppAction, IGlobalAppState } from "../../../../state/Store";
// types and interfaces //
import { StoreItemQueryPar } from "../type_definitions/storeItemTypes";
import { capitalizeString } from "../../../helpers/displayHelpers";
type DropdownData = {
  key: string;
  text: string;
  value: string;
}
type DropdownState = {
  loading: boolean;
  disabled: boolean;
  data: DropdownData[];
}
interface Props {
  dispatch: React.Dispatch<AppAction>
  state: IGlobalAppState;
}
// components //
const StoreItemsControlMenu: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedStores : stores } = state.storeState;
  // local state //
  const [ dropdownState, setDropdownState ] = useState<DropdownState>({
    loading: true,
    disabled: true,
    data: []
  });
  // stores ref //
  const storesRef = useRef<IStoreData[]>(stores);

  // dropdown handlers //
  const handleDateSortClick = (e: React.MouseEvent, data: DropdownItemProps): void => {
    const queryOption = data.value as string;
    setDropdownState({
      ...dropdownState,
      loading: true
    });
    getAllStoreItems(dispatch, { date: queryOption })
      .then((_) => {
        setDropdownState({
          ...dropdownState,
          loading: false
        });
      })
      .catch((_) => {
        // handle an error //
        setDropdownState({
          ...dropdownState,
          loading: false
        });
      });
  };
  const handlePriceSortClick = (e: React.MouseEvent, data: DropdownItemProps): void => {
    const queryOption = data.value as string;
    setDropdownState({
      ...dropdownState,
      loading: true
    });
    getAllStoreItems(dispatch, { price: queryOption })
      .then((_) => {
        setDropdownState({
          ...dropdownState,
          loading: false
        });
      })
      .catch((_) => {
        setDropdownState({
          ...dropdownState,
          loading: false
        });
      });
  };
  const handleNameSortClick = (e: React.MouseEvent, data: DropdownItemProps): void => {
    const queryOption = data.value as string;
    setDropdownState({
      ...dropdownState,
      loading: true
    });
    getAllStoreItems(dispatch, { name: queryOption })
      .then((_) => {
        setDropdownState({
          ...dropdownState,
          loading: false
        });
      })
      .catch((_) => {
        setDropdownState({
          ...dropdownState,
          loading: false
        });
      });
  };
  // lifecycle hooks //
  useEffect(() => {
    getAllStores(dispatch)
      .then((_) => {
        const updatedDropdownData = stores.map((store): DropdownData => {
          return {
            key: store._id,
            text: capitalizeString(store.title),
            value: store.title
          }
        })
        setDropdownState({
          loading: false,
          disabled: false,
          data: updatedDropdownData
        });
      })
      .catch((err) => {
        setDropdownState({
          loading: false,
          disabled: true,
          data: []
        });
      })
  }, []);
  // watches for new store data //
  useEffect(() => {
    if (storesRef.current && storesRef.current != stores) {
      // new store data //
      const updatedDropdownData = stores.map((store): DropdownData => {
        return {
          key: store._id,
          text: store.title,
          value: store.title
        };
      });

      setDropdownState({
        ...dropdownState,
        loading: false,
        disabled: false,
        data: updatedDropdownData
      });

    }
  }, [ stores, storesRef.current ]);
  // component return //
  return (
    <div>
    <Menu className="storeItemsControlsMenu">
      <Dropdown 
        id="adminStoreItemControlsStoreDropdown"
        item 
        text="Sort by Store Name"
        loading={dropdownState.loading}
        disabled={dropdownState.disabled}
        options={dropdownState.data}
      />
      <Menu.Item>
        <Dropdown 
          id={"adminStoreItemControlsDateDropdown"}
          text="Sort by Date" 
          loading={dropdownState.loading}
          disabled={dropdownState.disabled}
        >
          <Dropdown.Menu>
            <Dropdown.Item 
              id="adminStoreItemDateDescQuery"
              text="Descending" 
              description="newest first" 
              value="desc"
              onClick={handleDateSortClick}
            />
            <Dropdown.Item 
              id="adminStoreItemDateAscQuery"
              text="Ascending" 
              description="oldest first" 
              value="asc"
              onClick={handleDateSortClick}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
      <Menu.Item> 
        <Dropdown 
          id="adminStoreItemControlsPriceDropdown"
          text="Sort By Price"
          loading={dropdownState.loading}
          disabled={dropdownState.disabled}
        >
          <Dropdown.Menu>
            <Dropdown.Item 
              id="adminStoreItemPriceDescQuery"
              text="Descending" 
              description="expensive first" 
              value="desc"
              onClick={handlePriceSortClick}
            />
            <Dropdown.Item 
              id="adminStoreItemPriceAscQuery"
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
      <Menu.Item>
        <Dropdown 
          id="adminStoreITemContolsNameDropdown"
          text="Sort by name"
          loading={dropdownState.loading}
          disabled={dropdownState.disabled}
        >
          <Dropdown.Menu>
            <Dropdown.Item 
              id="adminStoreItemNameDescQuery"
              text="Descending" 
              description="Z - A" 
              value="desc"
              onClick={handleNameSortClick}
            />
            <Dropdown.Item 
              id="adminStoreItemNameAscQuery"
              text="Ascending" 
              description="A - Z" 
              value="asc"
              onClick={handleNameSortClick}
            />
          </Dropdown.Menu>

        </Dropdown>
        
      </Menu.Item>
      <Menu.Item>
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