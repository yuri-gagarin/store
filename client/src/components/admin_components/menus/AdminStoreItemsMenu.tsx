import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps, useRouteMatch } from "react-router-dom"
// css imports //
import "./css/adminStoreItemsMenu.css";
import { AppAction } from "../../../state/Store";

interface Props extends RouteComponentProps {
  dispatch: React.Dispatch<AppAction>
}
const AdminStoreItemsMenu: React.FC<Props> = ({ history, location, dispatch }): JSX.Element => {
  const [ scrolled, setScrolled ] = useState<boolean>(false);
  const [ activeItem, setActiveItem ] = useState<string>("view_all");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

  const match = useRouteMatch("/admin/home/my_store_items");
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
    <div className={ scrolled ? "adminStoreItemMenuFixed menuScrolled" : "adminStoreItemMenuFixed"} ref={adminStoreItemMenuRef}>
      <Menu tabular className={ menuOpen ? "adminStoreItemMenu storeItemMenuOpen" : "adminStoreItemMenu" }>
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