import React from "react";
import { Menu, Icon, MenuItemProps } from "semantic-ui-react";
// css imports //
import "./css/footerBar.css";

const FooterBar: React.FC<{}> = (props): JSX.Element => {
  const handleItemClick = (e: React.MouseEvent, data: MenuItemProps): void => {

  }
  return (
    <Menu icon id="footerMenu">
        <Menu.Item
          name='facebook'
          onClick={handleItemClick}
        >
          <Icon name='facebook official' />
        </Menu.Item>

        <Menu.Item
          name='twitter'
          onClick={handleItemClick}
        >
          <Icon name='twitter square' />
        </Menu.Item>

        <Menu.Item
          name='instagram'
          onClick={handleItemClick}
        >
          <Icon name='instagram' />
        </Menu.Item>
      </Menu>
  )
};

export default FooterBar;