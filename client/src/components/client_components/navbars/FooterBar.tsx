import React from "react";
import { Menu, Icon, MenuItemProps } from "semantic-ui-react";
// css imports //
import "./css/footerBar.css";
// routing //
import { withRouter, RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps {

}
const FooterBar: React.FC<Props> = ({ history }): JSX.Element => {
  const handleItemClick = (e: React.MouseEvent, data: MenuItemProps): void => {

  }
  const handleAdmin = (e: React.MouseEvent, data: MenuItemProps): void => {
    history.push("/admin/home");
  };

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
        <Menu.Item
          position="right"
          name="admin"
          onClick={handleAdmin}
        >
          <Icon name="lock"/>
          Admin
        </Menu.Item>
      </Menu>
  )
};

export default withRouter(FooterBar);