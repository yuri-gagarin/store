import React, { useState } from "react";
import { Menu, Dropdown, Icon, MenuItemProps } from "semantic-ui-react";
import { withRouter, RouteComponentProps } from "react-router-dom";

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

  return (
    <div style={{ position: "relative", width: "100%", zIndex: 999}}>
      <Menu attached='top'>
      <Dropdown item simple icon="file" text="File">
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
        name="store"
        content="My store"
        active={activeMenuItem === "store"}
        onClick={handleMenuClick}
      >
      </Menu.Item>
      <Menu.Item
        name="services"
        content="My Services"
        active={activeMenuItem === "services"}
        onClick={handleMenuClick}
      >
      </Menu.Item>
      <Menu.Item
        name="products"
        content="My Products"
        active={activeMenuItem === "products"}
        onClick={handleMenuClick}
      > 
      </Menu.Item>
      <Menu.Item
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
              placeholder='Search animals...'
            />
            <i className='search link icon' />
          </div>
          <div className='results' />
        </div>
      </Menu.Menu>
    </Menu>
    </div>
    
  )
};

export default withRouter(AdminTopMenu);