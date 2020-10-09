import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps, useRouteMatch } from "react-router-dom";
import { AdminServiceRoutes } from "../../../routes/adminRoutes";
// css imports //
import "./css/adminServiceMenu.css";
// state and actions //

interface Props extends RouteComponentProps {
  dispatch: React.Dispatch<ServiceAction>
}
const AdminServiceMenu: React.FC<Props> = ({ history, location, dispatch }): JSX.Element => {
  const [ scrolled, setScrolled ] = useState<boolean>(false);
  const [ activeItem, setActiveItem ] = useState<string>("");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
  // route matching for correct links //
  const match = useRouteMatch(AdminServiceRoutes.HOME_ROUTE);
  const adminServiceMenuRef = useRef<HTMLDivElement>(document.createElement("div"));

  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {

    setActiveItem(String(name));

    switch (name) {
      case "view_all": 
        history.push(match?.path + "/view_all");
        break;
      case "create":
        history.push(match?.path + "/create");
        dispatch({ type: "CLEAR_CURRENT_SERVICE", payload: null });
        break;
      case "manage":
        history.push(match?.path + "/manage");
        break;
      case "view_sorted": 
        history.push(match?.path + "/view_sorted");
        break;
      default: history.push(AdminServiceRoutes.HOME_ROUTE);
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

  }, [adminServiceMenuRef]);

  return (
    <div className={ scrolled ? "adminServiceMenuFixed menuScrolled" : "adminServiceMenuFixed"} ref={adminServiceMenuRef}>
      <Menu tabular className={ menuOpen ? "adminServiceMenu serviceMenuOpen" : "adminServiceMenu" }>
      <Menu.Item
          name='view_all'
          content="View All Services"
          active={activeItem === 'view_all'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='create'
          content="Create New Service"
          active={activeItem === 'create'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='manage'
          content="Manage Services"
          active={activeItem === 'manage'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='view_sorted'
          content="Sort Services"
          active={activeItem === 'view_sorted'}
          onClick={handleItemClick}
        />
      </Menu>
    </div>
  )
};

export default withRouter(AdminServiceMenu);