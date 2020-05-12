import React, { useState } from "react";
import { Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';


const MainNavSideBar: React.FC<{}> = (props): JSX.Element => {
  const [ menuOpen, setMenuOpen ] = useState(false);

  const handleMenuClose = (e: React.MouseEvent): void => {
    setMenuOpen(false);
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
        <Menu.Item as='a' onClick={handleMenuClose}>
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
        {props.children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default MainNavSideBar;
