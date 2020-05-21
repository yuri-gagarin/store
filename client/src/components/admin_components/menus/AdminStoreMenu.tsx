import React, { useState } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";


const AdminStoreMenu: React.FC<{}> = (props): JSX.Element => {
  const [ activeItem, setActiveItem ] = useState<string>("view_all");

  const handleItemClick = (e: React.MouseEvent, { name }: MenuItemProps): void => {
    setActiveItem(String(name));
  }

  return (
    <div>
      <Menu tabular>
      <Menu.Item
          name='view_all'
          content="View All"
          active={activeItem === 'view_all'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='create'
          content="Create Store"
          active={activeItem === 'create'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='manage'
          content="Manage"
          active={activeItem === 'manage'}
          onClick={handleItemClick}
        />
      </Menu>
    </div>
  )
};

export default AdminStoreMenu;