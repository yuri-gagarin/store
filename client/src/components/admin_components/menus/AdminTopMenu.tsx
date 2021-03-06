import React, { useState, useRef, useEffect } from "react";
import { Menu, Dropdown, Icon, MenuItemProps, DropdownItemProps } from "semantic-ui-react";
// css imports //
import "./css/adminTopMenu.css";
// routing //
import { withRouter, RouteComponentProps } from "react-router-dom";


interface Props extends RouteComponentProps {
};

const AdminTopMenu: React.FC<Props> = ({ history, location }): JSX.Element => {
  const [ activeMenuItem, setActiveMenuItem ] = useState<string>("");
  const [ menuFixed, setMenuFixed ] = useState<boolean>(false);
  const adminTopMenuRef = useRef<HTMLDivElement>(document.createElement("div"));

  const handleMenuClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveMenuItem(String(name));
    switch (name) {
      case "dash": {
        history.push("/admin/home/dash");
        break;
      }
      case "stores": {
        history.push("/admin/home/my_stores/all"); 
        break;
      }
      case "items": {
        history.push("/admin/home/store_items/all");
        break;
      }
      case "services": {
        history.push("/admin/home/my_services/all");
        break;
      }
      case "products": {
        history.push("/admin/home/my_products/all");
        break;
      }
      case "videos": {
        history.push("/admin/home/my_videos/all");
        break;
      }
      default: history.push("/admin/home");
    }
  };

  const handleFileClick = (e: React.MouseEvent, { name }: DropdownItemProps): void => {
    const baseUrl = "/admin/home/";
    switch (name) {
      case "store": {
        history.push(baseUrl + "my_stores/create");
        break;
      }
      case "service": {
        history.push(baseUrl + "my_services/create");
        break;
      }
      case "product": {
        history.push(baseUrl + "my_products/create");
        break;
      }
      case 'item': {
        history.push(baseUrl + "my_store_items/create");
        break;
      }
      case "video": {
        history.push(baseUrl + "my_videos/create");
        break;
      }
      default: history.push(baseUrl);

    }
  }
  const handleLogOut = () => {

  };

  const listenToMenuScroll = () => {
    if (window.scrollY > 1) {
      setMenuFixed(true);
    } else if (window.scrollY === 0) {
      setMenuFixed(false);
    }
  }

  useEffect(() => {
    const currentUrl = location.pathname;
    if (currentUrl.match(/dash/)) {
      setActiveMenuItem("dash");
    } else if (currentUrl.match(/my_stores/)) {
      setActiveMenuItem("stores");
    } else if (currentUrl.match(/my_services/)) {
      setActiveMenuItem("services");
    } else if (currentUrl.match(/my_products/)) {
      setActiveMenuItem("products");
    } else if (currentUrl.match(/my_videos/)) {
      setActiveMenuItem("videos");
    } else if (currentUrl.match(/store_items/)) {
      setActiveMenuItem("items");
    }
  }, [location])

  useEffect(() => {
    window.addEventListener("scroll", listenToMenuScroll, true);
  }, [adminTopMenuRef]);

  return (
    <div className={ menuFixed ? "adminTopAttached fixed" : "adminTopAttached"} ref={adminTopMenuRef}>
      <Menu attached='top' id="adminTopMenu">
      <Dropdown item simple icon="file" text="File" id="adminTopFileBtn">
        <Dropdown.Menu>
          <Dropdown.Item>
            <Icon name='dropdown' />
            <span className='text'>New</span>

            <Dropdown.Menu>
              <Dropdown.Item 
                onClick={handleFileClick} 
                name="store"
              >
                Store
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={handleFileClick} 
                name="item"
              >
                Store Item
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={handleFileClick}
                name="service"
              >
                Service
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={handleFileClick}
                name="product"
              >
                Product
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={handleFileClick}
                name="video"
              >
                Video
              </Dropdown.Item>
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
        name="dash"
        content="Dashboard"
        active={activeMenuItem === "dash"}
        onClick={handleMenuClick}
      >
      </Menu.Item>
      <Menu.Item
        className="adminTopMenuItem"
        name="stores"
        content="My Stores"
        active={activeMenuItem === "stores"}
        onClick={handleMenuClick}
      >
      </Menu.Item>
      <Menu.Item
        className="adminTopMenuItem"
        name="items"
        content="My Store Items"
        active={activeMenuItem === "items"}
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