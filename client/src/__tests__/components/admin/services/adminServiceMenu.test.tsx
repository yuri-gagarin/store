import React from "react";
import { Menu } from "semantic-ui-react";
// test dependencies
import { mount, ReactWrapper } from "enzyme";
import { MemoryRouter, Router } from "react-router-dom";
// component imports //
import AdminServiceMenu from "../../../../components/admin_components/menus/AdminServiceMenu";
// component dependencies //
import { AdminServiceRoutes } from "../../../../routes/adminRoutes";

describe("AdminServiceenu component render tests", () => {
  let wrapper: ReactWrapper;
  beforeAll(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={[AdminServiceRoutes.ADMIN_SERVICES_HOME_ROUTE]} keyLength={0}>
        <AdminServiceMenu dispatch={jest.fn}/>
      </MemoryRouter>
    )
  });
  describe("Default component render", () => {
    it("Should properly render and match snapshot", () => {
      expect(wrapper.find(AdminServiceMenu)).toMatchSnapshot();
    });
    it("Should have 4 'Menu.Item' components", () => {
      const menuItems = wrapper.find(Menu.Item);
      expect(menuItems.length).toEqual(4);
    });
    it("Should not have any of the links in 'active' state", () => {
      const menuItems = wrapper.find(Menu.Item);
      menuItems.forEach((item) => {
        expect(item.props().active).toEqual(false);
      })
    })
  });

  describe("AdminServiceenu component nav button tests", () => {
    
    it("Should correctly respond to 'View All' 'Menu.Item' click", () => {
      window.scrollTo = jest.fn;
      const menuItems = wrapper.find(Menu.Item)
      menuItems.at(0).simulate("click");
      wrapper.update();
      // assert correct rendering //
      expect(wrapper.find(Menu.Item).at(0).props().active).toEqual(true);
      expect(wrapper.find(Menu.Item).at(1).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(2).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(3).props().active).toEqual(false);
      // assert correct client route //
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminServiceRoutes.ADMIN_SERVICES_VIEW_ALL_ROUTE);

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
      expect(wrapper.find(Menu.Item).at(3).props().active).toEqual(false);
      // assert correct client route //
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminServiceRoutes.ADMIN_SERVICES_CREATE_ROUTE);
    });
    it("Should correctly respond to 'Manage' 'Menu.Item' click", () => {
      window.scrollTo = jest.fn;
      const menuItems = wrapper.find(Menu.Item)
      menuItems.at(2).simulate("click");
      wrapper.update();
      // assert correct rendering //
      expect(wrapper.find(Menu.Item).at(0).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(1).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(2).props().active).toEqual(true);
      expect(wrapper.find(Menu.Item).at(3).props().active).toEqual(false);
      // assert correct client route //
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminServiceRoutes.ADMIN_SERVICES_MANAGE_ROUTE);
    })
    it("Should correctly respond to 'View Sorted' 'Menu.Item' click", () => {
      window.scrollTo = jest.fn;
      const menuItems = wrapper.find(Menu.Item)
      menuItems.at(3).simulate("click");
      wrapper.update();
      // assert correct rendering //
      expect(wrapper.find(Menu.Item).at(0).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(1).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(2).props().active).toEqual(false);
      expect(wrapper.find(Menu.Item).at(3).props().active).toEqual(true);
      // assert correct client route //
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminServiceRoutes.ADMIN_SERVICES_VIEW_SORTED_ROUTE);
    })
  })
})