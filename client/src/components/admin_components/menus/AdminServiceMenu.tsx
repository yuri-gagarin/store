import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps, useRouteMatch } from "react-router-dom"
// css imports //
import "./css/adminServiceMenu.css";
import { AppAction } from "../../../state/Store";

interface Props extends RouteComponentProps {
  dispatch: React.Dispatch<AppAction>
}
const AdminServiceMenu: React.FC<Props> = ({ history, dispatch }): JSX.Element => {
  const [ scrolled, setScrolled ] = useState<boolean>(false);
  const [ activeItem, setActiveItem ] = useState<string>("view_all");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

  const match = useRouteMatch("/admin/home/my_services");
  const adminServiceMenuRef = useRef<HTMLDivElement>(document.createElement("div"));

  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveItem(String(name));


    switch (name) {
      case "view_all": 
        history.push(match?.path + "/all");
        break;
      case "create":
        history.push(match?.path + "/create");
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

  useEffect(() => {
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
      </Menu>
    </div>
  )
};

export default withRouter(AdminServiceMenu);