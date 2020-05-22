import React, { useState, useEffect } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps } from "react-router-dom"
// css imports //
import "./css/adminStoreMenu.css";

interface Props extends RouteComponentProps {

}
const AdminStoreMenu: React.FC<Props> = ({ history }): JSX.Element => {
  const [ activeItem, setActiveItem ] = useState<string>("view_all");
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveItem(String(name));
    const baseUrl: string = "/admin/home/my_store";
    switch (name) {
      case "view_all": 
        history.push(baseUrl + "/all");
        break;
      case "create":
        history.push(baseUrl + "/create");
        break;
      case "manage":
        history.push(baseUrl + "/manage");
        break;
      default: history.push(baseUrl);
    }
  }
  useEffect(() => {
    setTimeout(() => {
      setMenuOpen(true);
    }, 200);
  }, []);

  return (
    <div>
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