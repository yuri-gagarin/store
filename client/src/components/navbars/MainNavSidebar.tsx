import React, { useState } from "react";
import { Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';

import TopNavbar from "../navbars/TopNav"
import HomeScreenComponent from "../home_screen/HomeScreenComponent";

const MainNavSideBar: React.FC<{}> = (props): JSX.Element => {
  const [ menuOpen, setMenuOpen ] = useState(false);

  const handleSidebarClose = (e: React.MouseEvent): void => {
    setMenuOpen(false);
  };

  const handleSidebarOpen = (e: React.MouseEvent): void => {
    setMenuOpen(true);
  };

  return (
    <Sidebar.Pushable as={Segment} style={{ height: "100vh" }}>
      <Sidebar
        as={Menu}
        animation='overlay'
        icon='labeled'
        inverted
        vertical
        visible={menuOpen}
        width='wide'
      >
        <Menu.Item as='a' onClick={handleSidebarClose}>
          <Icon name='close'/>
          Close
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='home'/>
          Home
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='gamepad' />
          Games
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
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
