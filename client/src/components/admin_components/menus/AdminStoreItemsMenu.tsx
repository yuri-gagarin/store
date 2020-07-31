import React, { useState, useEffect, useRef } from "react";
import { Dropdown, DropdownProps, Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps, useRouteMatch } from "react-router-dom"
// css imports //
import "./css/adminStoreItemsMenu.css";
// actions and state //
import { AppAction, IGlobalAppState } from "../../../state/Store";
import { getAllStores } from "../stores/actions/APIstoreActions";
import { getAllStoreItems } from "../store_items/actions/APIStoreItemActions";
// helpers //
import { capitalizeString } from "../../helpers/displayHelpers";

interface Props extends RouteComponentProps {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
interface DProps {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}
type DropdownData = {
  key: string;
  text: string;
  value: string;
}
const StoreNameDropDown: React.FC<DProps> = ({ state, dispatch }): JSX.Element => {
  const [ dropdownState, setDropdownState ] = useState<DropdownData[]>();
  const { loadedStores } = state.storeState;

  const handleSearchChange = (e: React.SyntheticEvent, data: DropdownProps): void => {
    console.log(31);
    console.log(e)
    console.log(data.value);
    const queryOptions = {
      storeName: data.value as string
    }
    getAllStoreItems(dispatch, queryOptions)
  }
  useEffect(() => {
    getAllStores(dispatch)
  }, [])
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
}
const AdminStoreItemsMenu: React.FC<Props> = ({ history, location, state, dispatch }): JSX.Element => {
  const [ scrolled, setScrolled ] = useState<boolean>(false);
  const [ activeItem, setActiveItem ] = useState<string>("view_all");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

  const match = useRouteMatch("/admin/home/store_items");
  const adminStoreItemMenuRef = useRef<HTMLDivElement>(document.createElement("div"));

  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveItem(String(name));


    switch (name) {
      case "view_all": 
        history.push(match?.path + "/all");
        break;
      case "create":
        history.push(match?.path + "/create");
        dispatch({ type: "CLEAR_CURRENT_STORE_ITEM", payload: null });
        break;
      case "manage":
        history.push(match?.path + "/manage");
        break;
      default: history.push("/admin/home");
    }
  }
 
  const scrollListener = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else if (window.scrollY === 0) {
      setScrolled(false)
    } 
  };
  // lifecycle hooks //
  useEffect(() => {
    const currentURL = location.pathname;
    setTimeout(() => {
      setMenuOpen(true);
    }, 200);
    if (currentURL.match(/all/)) {
      setActiveItem("view_all");
    } else if (currentURL.match(/create/)) {
      setActiveItem("create");
    } else if (currentURL.match(/manage/)) {
      setActiveItem("manage");
    }
    // menu animation timeout //
    setTimeout(() => {
      setMenuOpen(true);
    }, 200);
  }, []);

  useEffect(() => {

    window.addEventListener("scroll", scrollListener, true);
    return () => window.removeEventListener("scroll", scrollListener);

  }, [adminStoreItemMenuRef]);

  return (
    <div className={ scrolled ? "adminStoreItemsMenuFixed menuScrolled" : "adminStoreItemsMenuFixed"} ref={adminStoreItemMenuRef}>
      <Menu tabular className={ menuOpen ? "adminStoreItemsMenu storeItemsMenuOpen" : "adminStoreItemsMenu" }>
        <StoreNameDropDown state={state} dispatch={dispatch} />
        <Menu.Item
          name='view_all'
          content="View All StoreItems"
          active={activeItem === 'view_all'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='create'
          content="Create New StoreItem"
          active={activeItem === 'create'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='manage'
          content="Manage StoreItems"
          active={activeItem === 'manage'}
          onClick={handleItemClick}
        />
      </Menu>
    </div>
  )
};

export default withRouter(AdminStoreItemsMenu);