import React, { useState } from "react";
import { Menu, Dropdown, Icon, MenuItemProps } from "semantic-ui-react";
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/adminTopMenu.css";

interface Props extends RouteComponentProps {

};

const AdminTopMenu: React.FC<Props> = ({ history }): JSX.Element => {
  const [ activeMenuItem, setActiveMenuItem ] = useState<string>("");
  const handleMenuClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveMenuItem(String(name));
    switch (name) {
      case "store": history.push("/admin/home/my_store"); 
        break;
      case "services": history.push("/admin/home/my_services");
        break;
      case "products": history.push("/admin/home/my_products");
        break;
      case "videos": history.push("/admin/home/my_videos");
        break;
      default: history.push("/admin/home");
    }
  };
  const handleLogOut = () => {

  };
  return (
    <div style={{ position: "relative", width: "100%", zIndex: 999}}>
      <Menu attached='top' id="adminTopMenu">
      <Dropdown item simple icon="file" text="File" id="adminTopFileBtn">
        <Dropdown.Menu>
          <Dropdown.Item>
            <Icon name='dropdown' />
            <span className='text'>New</span>

            <Dropdown.Menu>
              <Dropdown.Item>Document</Dropdown.Item>
              <Dropdown.Item>Image</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>
          <Dropdown.Item>Open</Dropdown.Item>
          <Dropdown.Item>Save...</Dropdown.Item>
          <Dropdown.Item>Edit Permissions</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Export</Dropdown.Header>
          <Dropdown.Item>Share</Dropdown.Item>
        </Dropdown.Menu>
       
      </Dropdown>
      <Menu.Item
        className="adminTopMenuItem"
        name="store"
        content="My store"
        active={activeMenuItem === "store"}
        onClick={handleMenuClick}
      >
      </Menu.Item>
      <Menu.Item
        className="adminTopMenuItem"
        name="services"
        content="My Services"
        active={activeMenuItem === "services"}
        onClick={handleMenuClick}
      >
      </Menu.Item>
      <Menu.Item
        className="adminTopMenuItem"
        name="products"
        content="My Products"
        active={activeMenuItem === "products"}
        onClick={handleMenuClick}
      > 
      </Menu.Item>
      <Menu.Item
        className="adminTopMenuItem"
        name="videos"
        content="My Videos"
        active={activeMenuItem === "videos"}
        onClick={handleMenuClick}
      >
      </Menu.Item>

      <Menu.Menu position='right'>
        <div className='ui right aligned category search item'>
          <div className='ui transparent icon input'>
            <input
              className='prompt'
              type='text'
              placeholder='Search...'
            />
            <i className='search link icon' />
          </div>
          <div className='results' />
        </div>
        <Menu.Item
          as="a"
          name="logout"
          content="Log Out"
          onClick={handleLogOut}
        >
        </Menu.Item>
      </Menu.Menu>
    </Menu>
    </div>
    
  )
};

export default withRouter(AdminTopMenu);