import React, { useState, useRef, useEffect } from "react";
import { Responsive, Menu, MenuItemProps, Icon, Sidebar } from "semantic-ui-react";

// css imports //
import "./css/desktopMenu.css";

interface Props {
  handleSidebarOpen(e: React.MouseEvent): void;
};
interface Coordinates {
  posY: number;
  posX: number;
}

const TopNavbar: React.FC<Props> = ({ handleSidebarOpen, children }): JSX.Element => {
  const [ activeItem, setActiveItem ] = useState<string>("home");
  const [ coordinates, setCoordinates ] = useState<Coordinates>({ posX: 0, posY: 0 });
  const [ navLocked, setNavLocked ] = useState<boolean>(false);
  const [ topMenuVisible, setTopMenuVisible ] = useState(false);
  const desktopNavRef = useRef<HTMLDivElement>(document.createElement("div"));

  const listenToScroll = (e: Event): void => {
    if (desktopNavRef.current) {
      const compCoordinates: DOMRect = desktopNavRef.current.getBoundingClientRect();
      setCoordinates({
        posX: compCoordinates.x,
        posY: compCoordinates.y
      });
    }
  };

  const handleItemClick = (e: React.MouseEvent, data: MenuItemProps): void => {
    setActiveItem(String(data.name));
  };
  const handleMenuOpen = (e: React.MouseEvent, data: MenuItemProps): void => {
    setTopMenuVisible(true);
  };
  const handleMenuClose = (e: React.MouseEvent, data: MenuItemProps): void => {
    setTopMenuVisible(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll, true);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, [desktopNavRef]);

  useEffect(() => {
    if (coordinates.posY < -15) {
      setNavLocked(true);
    } else if (coordinates.posY === 0 || coordinates.posY > -15) {
      setNavLocked(false);
    }
  }, [coordinates]);

  return (
    <div style={{ width: "100%", padding: 0 }}>
      <Responsive minWidth={568}>
        <div ref={desktopNavRef}>
          <Menu style={{ height: "50px", width: "100%" }} className={ navLocked ? "desktopMenu navLocked" : "desktopMenu"}>
            <Menu.Item
              name='menu'
              className="menuItem"
              id="mainMenuBtn"
              active={false}
              onClick={handleSidebarOpen}
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
          {children}
        </div>
      </Responsive>
      <Responsive maxWidth={567}>
        <Menu id="mobileNavbar" className={ topMenuVisible ? "topInvisible" : "" }>
          <Menu.Item
            id="mobileTopMenuOpen"
            className="menuItem"
            onClick={handleMenuOpen}
          >
           <Icon name="align justify" />
          </Menu.Item>
        </Menu>
        <Sidebar.Pushable>
            <Sidebar
            className="topMenu"
            as={Menu}
            animation='overlay'
            icon='labeled'
            direction="top"
            vertical
            visible={topMenuVisible}
            width='wide'
          >
            <Menu.Item as='a' 
              onClick={handleMenuClose}
              id="mobileTopMenuClose"
            >
              <Icon name='close' />
              Close
            </Menu.Item>
            <Menu.Item as='a' className="mobileMenuItem">
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as='a' className="mobileMenuItem">
              <Icon name='cut' />
              Products
            </Menu.Item>
            <Menu.Item as='a' className="mobileMenuItem">
              <Icon name='cart' />
              Store
            </Menu.Item>
            <Menu.Item as='a' className="mobileMenuItem">
              <Icon name='users' />
              About Us
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    </div>
  );
};

export default TopNavbar;