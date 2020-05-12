import React, { useState } from "react";
import { Responsive, Menu, MenuItemProps, Segment, Icon } from "semantic-ui-react";
// css imports //
import "./css/desktopMenu.css";

const TopNavbar: React.FC<{}> = (props): JSX.Element => {
  const [ activeItem, setActiveItem ] = useState<string>("home");

  const handleItemClick = (e: React.MouseEvent, data: MenuItemProps): void => {
    setActiveItem(String(data.name));
  };

  const handleMenuOpen = (e: React.MouseEvent, data: MenuItemProps): void => {

  };

  return (
    <Segment style={{ width: "100%", padding: 0 }}>
      <Responsive minWidth={768}>
        <Menu style={{ height: "50px", width: "100%" }} className="desktopMenu">
          <Menu.Item
            name='menu'
            className="menuItem"
            active={false}
            onClick={handleMenuOpen}
          >
           <Icon name="align justify" />
          </Menu.Item>
          <Menu.Item
            name='home'
            className="menuItem"
            active={activeItem === 'home'}
            onClick={handleItemClick}
          >
            Home
          </Menu.Item>
          <Menu.Item
            name='products'
            className="menuItem"
            active={activeItem === 'products'}
            onClick={handleItemClick}
          >
            Products
          </Menu.Item>
          <Menu.Item
            name='store'
            className="menuItem"
            active={activeItem === 'store'}
            onClick={handleItemClick}
          >
            Store
          </Menu.Item>
          <Menu.Item
            name='about us'
            className="menuItem"
            active={activeItem === 'about us'}
            onClick={handleItemClick}
          >
            About Us
          </Menu.Item>
        </Menu>
      </Responsive>
      <Responsive maxWidth={767}>

      </Responsive>
    </Segment>
  );
};

export default TopNavbar;