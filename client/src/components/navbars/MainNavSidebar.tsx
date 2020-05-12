import React, { useState } from "react";
import { Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';
// styling and overrides //
import "./css/mainSidebar.css";
// additional components //
import TopNavbar from "../navbars/TopNav";
import HomeScreenComponent from "../home_screen/HomeScreenComponent";

const MainNavSideBar: React.FC<{}> = (props): JSX.Element => {
  const [ menuOpen, setMenuOpen ] = useState(true);

  const handleSidebarClose = (e: React.MouseEvent): void => {
    setMenuOpen(false);
  };

  const handleSidebarOpen = (e: React.MouseEvent): void => {
    setMenuOpen(true);
  };

  return (
    <Sidebar.Pushable 
      as={Segment} 
      style={{ height: "100vh" }}
    >
      <Sidebar
        as={Menu}
        id="mainNavSidebar"
        animation='overlay'
        icon='labeled'
        vertical
        visible={menuOpen}
        width='wide'
      >
        <Menu.Item 
          as='a' 
          id="mainSidebarClose"
          onClick={handleSidebarClose}
        >
          <Icon name='close'/>
          <span>Close</span>
        </Menu.Item>
        <Menu.Item as='a' className="mainSidebarItem">
          <Icon name='home'/>
          <span>Home</span>
        </Menu.Item>
        <Menu.Item as='a' className="mainSidebarItem">
          <Icon name='shopping cart' />
          <span>Browse Store</span>
        </Menu.Item>
        <Menu.Item as='a' className="mainSidebarItem">
          <Icon name='star' />
          <span>Browse Specials</span>
        </Menu.Item>
        <Menu.Item as='a' className="mainSidebarItem">
          <Icon name='camera' />
          <span>Browse Additional</span>
        </Menu.Item>
        <Menu.Item as='a' className="mainSidebarItem">
          <Icon name='phone' />
          <span>Contact</span>
        </Menu.Item>
      </Sidebar>

      <Sidebar.Pusher>
        <TopNavbar handleSidebarOpen={handleSidebarOpen}>
          <HomeScreenComponent title={"Home Screen"} />
        </TopNavbar>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default MainNavSideBar;
