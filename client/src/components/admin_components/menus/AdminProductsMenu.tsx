import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps, useRouteMatch } from "react-router-dom"
// css imports //
import "./css/adminProductsMenu.css";
// actions and state //
import { AppAction } from "../../../state/Store";

interface Props extends RouteComponentProps {
  dispatch: React.Dispatch<AppAction>
}
const AdminProductsMenu: React.FC<Props> = ({ history, location, dispatch }): JSX.Element => {
  const [ scrolled, setScrolled ] = useState<boolean>(false);
  const [ activeItem, setActiveItem ] = useState<string>("view_all");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

  const match = useRouteMatch("/admin/home/my_products");
  const adminProductsMenuRef = useRef<HTMLDivElement>(document.createElement("div"));

  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveItem(String(name));


    switch (name) {
      case "view_all": {
        history.push(match?.path + "/all");
        break;
      }
      case "create": {
        history.push(match?.path + "/create");
        dispatch({ type: "CLEAR_CURRENT_PRODUCT", payload: null });
        break;
      }
      case "manage": {
        history.push(match?.path + "/manage");
        break;
      }
      case 'sorted': {
        history.push(match?.path + "/view_sorted");
        break;
      }
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
    } else if (currentURL.match(/sorted/)) {
      setActiveItem("sorted");
    }
    // menu animation timeout //
    setTimeout(() => {
      setMenuOpen(true);
    }, 200);
  }, []);

  useEffect(() => {

    window.addEventListener("scroll", scrollListener, true);
    return () => window.removeEventListener("scroll", scrollListener);

  }, [adminProductsMenuRef]);

  return (
    <div className={ scrolled ? "adminProductsMenuFixed menuScrolled" : "adminProductsMenuFixed"} ref={adminProductsMenuRef}>
      <Menu tabular className={ menuOpen ? "adminProductsMenu productsMenuOpen" : "adminProductsMenu" }>
      <Menu.Item
          name='view_all'
          content="View All Products"
          active={activeItem === 'view_all'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='create'
          content="Create New Product"
          active={activeItem === 'create'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='manage'
          content="Manage Products"
          active={activeItem === 'manage'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name="sorted"
          content="View Sorted Products"
          active={activeItem === "sorted"}
          onClick={handleItemClick}
        >
        </Menu.Item>
      </Menu>
    </div>
  )
};

export default withRouter(AdminProductsMenu);