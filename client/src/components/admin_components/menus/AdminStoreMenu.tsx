import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps } from "react-router-dom"
// css imports //
import "./css/adminStoreMenu.css";
import { AppAction } from "../../../state/Store";

interface Props extends RouteComponentProps {
  dispatch: React.Dispatch<AppAction>
}
const AdminStoreMenu: React.FC<Props> = ({ history, dispatch }): JSX.Element => {
  const [ scrolled, setScrolled ] = useState<boolean>(false);
  const [ activeItem, setActiveItem ] = useState<string>("view_all");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

  const adminStoreMenuRef = useRef<HTMLDivElement>(document.createElement("div"));

  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveItem(String(name));
    const baseUrl: string = "/admin/home/my_stores";
    switch (name) {
      case "view_all": 
        history.push(baseUrl + "/all");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "create":
        history.push(baseUrl + "/create");
        dispatch({ type: "CLEAR_CURRENT_STORE", payload: null });
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "manage":
        history.push(baseUrl + "/manage");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      default: history.push(baseUrl);
    }
  }
  useEffect(() => {
    setTimeout(() => {
      setMenuOpen(true);
    }, 200);
  }, []);
  const scrollListener = () => {
    /*
    if (window.scrollY > adminStoreMenuRef.current.getBoundingClientRect().y) {
      console.log("should lock")
    } 
    */
    if (window.scrollY > 1) {
      setScrolled(true);
    } else if (window.scrollY === 0) {
      setScrolled(false)
    } 
  }

  useEffect(() => {

    window.addEventListener("scroll", scrollListener, true);
    return () => window.removeEventListener("scroll", scrollListener);

  }, [adminStoreMenuRef]);

  return (
    <div className={ scrolled ? "adminStoreMenuFixed menuScrolled" : "adminStoreMenuFixed"} ref={adminStoreMenuRef}>
      <Menu tabular className={ menuOpen ? "adminStoreMenu storeMenuOpen" : "adminStoreMenu" }>
      <Menu.Item
          name='view_all'
          content="View All"
          active={activeItem === 'view_all'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='create'
          content="Create Store"
          active={activeItem === 'create'}
          onClick={handleItemClick}
        />
        <Menu.Item
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