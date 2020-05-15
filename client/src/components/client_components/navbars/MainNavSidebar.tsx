import React, { useState } from "react";
import { Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';
// styling and overrides //
import "./css/mainSidebar.css";
// additional components //
import TopNavbar from "./TopNav";
import HomeScreenComponent from "../home_screen/HomeScreenComponent";
import StoreHolder from "../store_screen/StoreHolder";
import { Switch, Route } from "react-router-dom";

const MainNavSideBar: React.FC<{}> = (props): JSX.Element => {
  const [ menuOpen, setMenuOpen ] = useState(false);

  const handleSidebarClose = (e: React.MouseEvent): void => {
    setMenuOpen(false);
  };

  const handleSidebarOpen = (e: React.MouseEvent): void => {
    setMenuOpen(true);
  };

  return (
    <Sidebar.Pushable 
      as={Segment} 
      style={{ transform: "none" }}
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
              <Switch>
                <Route path="/store">
                  <StoreHolder />
                </Route>
                <Route path="/">
                  <HomeScreenComponent title=""/>
                </Route>
              </Switch>
          </TopNavbar>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default MainNavSideBar;
