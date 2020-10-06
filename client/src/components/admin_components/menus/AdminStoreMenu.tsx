import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps, useRouteMatch } from "react-router-dom";
import { AdminStoreRoutes } from "../../../routes/adminRoutes";
// css imports //
import "./css/adminStoreMenu.css";
// state and actions //

interface Props extends RouteComponentProps {
  dispatch: React.Dispatch<StoreAction>
}
const AdminStoreMenu: React.FC<Props> = ({ history, location,  dispatch }): JSX.Element => {
  // local component state //
  const [ scrolled, setScrolled ] = useState<boolean>(false);
  const [ activeItem, setActiveItem ] = useState<string>("");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
  // route match for correct links //
  const match = useRouteMatch(AdminStoreRoutes.ADMIN_STORES_HOME_ROUTE);
  const adminStoreMenuRef = useRef<HTMLDivElement>(document.createElement("div"));

  // event and handler listeners //
  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveItem(String(name));

    switch (name) {
      case "view_all": 
        history.push(match?.path + "/view_all");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "create":
        history.push(match?.path + "/create");
        dispatch({ type: "CLEAR_CURRENT_STORE", payload: null });
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "manage":
        history.push(match?.path + "/manage");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      default: history.push(AdminStoreRoutes.ADMIN_STORES_HOME_ROUTE);
    }
  };
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

    if (currentURL.match(/view_all/)) {
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
    let componentLoaded = true;
    if (componentLoaded) {
      window.addEventListener("scroll", scrollListener, true);
    }
    return () => {
      componentLoaded = false;
      window.removeEventListener("scroll", scrollListener)
    };

  }, [adminStoreMenuRef]);

  return (
    <div className={ scrolled ? "adminStoreMenuFixed menuScrolled" : "adminStoreMenuFixed"} ref={adminStoreMenuRef}>
      <Menu tabular className={ menuOpen ? "adminStoreMenu storeMenuOpen" : "adminStoreMenu" }>
      <Menu.Item
          className="adminMenuLink"
          name='view_all'
          content="View All"
          active={activeItem === 'view_all'}
          onClick={handleItemClick}
        />
        <Menu.Item
          className="adminMenuLink"
          name='create'
          content="Create Store"
          active={activeItem === 'create'}
          onClick={handleItemClick}
        />
        <Menu.Item
          className="adminMenuLink"
          name='manage'
          content="Manage"
          active={activeItem === 'manage'}
          onClick={handleItemClick}
        />
      </Menu>
    </div>
  )
};

export default withRouter(AdminStoreMenu);