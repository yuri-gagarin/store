import React from "react";
import { Menu } from "semantic-ui-react";
// test dependencies
import { mount, ReactWrapper } from "enzyme";
import { MemoryRouter, Router } from "react-router-dom";
// component imports //
import AdminProductsMenu from "../../../../components/admin_components/menus/AdminProductsMenu";
// component dependencies //
import { AdminProductRoutes } from "../../../../routes/adminRoutes";

describe("AdminProductMenu component render tests", () => {
  let wrapper: ReactWrapper;
  beforeAll(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={[AdminProductRoutes.HOME_ROUTE]} keyLength={0}>
        <AdminProductsMenu dispatch={jest.fn}/>
      </MemoryRouter>
    )
  });
  describe("Default component render", () => {
    it("Should properly render and match snapshot", () => {
      expect(wrapper.find(AdminProductsMenu)).toMatchSnapshot();
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

  describe("AdminProductMenu component nav button tests", () => {
    
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
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminProductRoutes.VIEW_ALL_ROUTE);

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
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminProductRoutes.CREATE_ROUTE);
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
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
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
      expect(wrapper.find(Router).props().history.location.pathname).toEqual(AdminProductRoutes.VIEW_SORTED_ROUTE);
    })
  })
})