import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps, useRouteMatch } from "react-router-dom";
import { AdminStoreItemRoutes } from "../../../routes/adminRoutes";
// css imports //
import "./css/adminStoreItemsMenu.css";
// helpers //

interface Props extends RouteComponentProps {
  dispatch: React.Dispatch<StoreItemAction>;
}

const AdminStoreItemsMenu: React.FC<Props> = ({ history, location, dispatch }): JSX.Element => {
  const [ scrolled, setScrolled ] = useState<boolean>(false);
  const [ activeItem, setActiveItem ] = useState<string>("");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

  const match = useRouteMatch(AdminStoreItemRoutes.HOME_ROUTE);
  const adminStoreItemMenuRef = useRef<HTMLDivElement>(document.createElement("div"));

  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveItem(String(name));

    switch (name) {
      case "view_all": 
        history.push(match?.path + "/view_all");
        break;
      case "create":
        history.push(match?.path + "/create");
        dispatch({ type: "CLEAR_CURRENT_STORE_ITEM", payload: { error: null } });
        break;
      case "manage":
        history.push(match?.path + "/manage");
        break;
      case "view_sorted": 
        history.push(match?.path + "/view_sorted");
        break;
      default: history.push(AdminStoreItemRoutes.HOME_ROUTE);
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
    if (currentURL.match(/view_all/)) {
      setActiveItem("view_all");
    } else if (currentURL.match(/create/)) {
      setActiveItem("create");
    } else if (currentURL.match(/manage/)) {
      setActiveItem("manage");
    } else if (currentURL.match(/view_sorted/)) {
      setActiveItem("view_sorted");
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
        <Menu.Item
          name='view_all'
          content="View All StoreItems"
          active={activeItem === 'view_all'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='create'
          content="Create New Store Item"
          active={activeItem === 'create'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='manage'
          content="Manage Store Items"
          active={activeItem === 'manage'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name="view_sorted"
          content="Sort Store Items"
          active={activeItem === "view_sorted"}
          onClick={handleItemClick}
        />
      </Menu>
    </div>
  )
};

export default withRouter(AdminStoreItemsMenu);