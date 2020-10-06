import React from "react";
import { mount, ReactWrapper } from "enzyme";
import AdminStoreMenu from "../../../../components/admin_components/menus/AdminStoreMenu";
import { MemoryRouter, Router } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";

describe("AdminStoreMenu component render tests", () => {
  let wrapper: ReactWrapper;
  beforeAll(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={[AdminStoreRoutes.ADMIN_STORES_HOME_ROUTE]} keyLength={0}>
        <AdminStoreMenu dispatch={jest.fn}/>
      </MemoryRouter>
    )
  });
  describe("Default component render", () => {
    it("Should properly render and match snapshot", () => {
      expect(wrapper.find(AdminStoreMenu)).toMatchSnapshot();
    });
    it("Should have 3 'Menu.Item' components", () => {
      const menuItems = wrapper.find(Menu.Item);
      expect(menuItems.length).toEqual(3);
    });
    it("Should not have any of the links in 'active' state", () => {
      const menuItems = wrapper.find(Menu.Item);
      menuItems.forEach((item) => {
        expect(item.props().active).toEqual(false);
      })
    })
  });

  describe("AdminStoreMenu component nav button tests", () => {
    
    it("Should correctly respond to 'View All' 'Menu.Item' click", () => {
      window.scrollTo = jest.fn;
      const menuItems = wrapper.find(Menu.Item)
      menuItems.at(0).simulate("click");
      wrapper.update();
      // assert correct rendering //
      expect(wrapper.find(Menu.Item).at(0).props().active).toEqual(true);
      expect(wrapper.find(Menu.Item).at(1).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(2).props().active).toEqual(false);
      // assert correct client route //
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminStoreRoutes.ADMIN_STORES_VIEW_ALL_ROUTE);

    });
    it("Should correctly respond to 'Create' 'Menu.Item' click", () => {
      window.scrollTo = jest.fn;
      const menuItems = wrapper.find(Menu.Item)
      menuItems.at(1).simulate("click");
      wrapper.update();
      // assert correct rendering //
      expect(wrapper.find(Menu.Item).at(0).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(1).props().active).toEqual(true);
      expect(wrapper.find(Menu.Item).at(2).props().active).toEqual(false);
      // assert correct client route //
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminStoreRoutes.ADMIN_STORES_CREATE_ROUTE);
    })
    it("Should correctly respond to 'Manage' 'Menu.Item' click", () => {
      window.scrollTo = jest.fn;
      const menuItems = wrapper.find(Menu.Item)
      menuItems.at(2).simulate("click");
      wrapper.update();
      // assert correct rendering //
      expect(wrapper.find(Menu.Item).at(0).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(1).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(2).props().active).toEqual(true);
      // assert correct client route //
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminStoreRoutes.ADMIN_STORES_MANAGE_ROUTE);
    })
  })
})