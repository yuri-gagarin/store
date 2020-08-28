import React, { ReactElement } from "react";
import { Menu } from "semantic-ui-react";
import { mount, ReactWrapper } from "enzyme";
// component imports //
import StoreItemsViewComponent from "../../../../components/admin_components/store_items/StoreItemsView";
import AdminStoreItemsMenu from "../../../../components/admin_components/menus/AdminStoreItemsMenu";
import StoreItemsPreviewHolder from "../../../../components/admin_components/store_items/store_items_preview/StoreItemsPreviewHolder";
import StoreItemFormHolder from "../../../../components/admin_components/store_items/forms/StoreItemFormHolder";
// additional dependencies //
import  { BrowserRouter as Router, Switch, MemoryRouter } from "react-router-dom";
import { StoreItemsManageHolder } from "../../../../components/admin_components/store_items/store_items_manage/StoreItemsManageHolder";

describe("StoreItemView Component test", () => {
  let component: ReactWrapper;
  beforeAll(() => {
    component = mount<{}, typeof Router>(
      <MemoryRouter initialEntries={["/admin/home/store_items"]}>
        <StoreItemsViewComponent />
      </MemoryRouter>
    );
  });
  describe("StoreItemView Component render test", () => {
    it("Should correctly mount", () => {
      expect(component).toBeDefined();
    });
    it("Should render Admin StoreItem Menu", () => {
      expect(component.find(AdminStoreItemsMenu)).toHaveLength(1);
    });
    it("Should render conditional routes", () => {
      expect(component.find("Switch")).toHaveLength(1);
    });
    it("Should have Render three children route componets", () => {
      const switchComponent = component.find(Switch);
      expect(switchComponent.props().children).toHaveLength(3);
    });
    it("Should have proper client routes and conditionally render correct Components", () => {
      const switchComponent = component.find(Switch);
      type RouteMap = {
        [key: string]: string
      }
      let map: RouteMap = {};

      const routeComponents = switchComponent.props().children as ReactElement[];
      for (const component of routeComponents) {
        if (component.props.children[1].type.WrappedComponent) {
          // to check if a component is wrapped in a WithRouter() function //
          map[component.props.path as string] = component.props.children[1].type.WrappedComponent;
        } else {
          map[component.props.path as string] = component.props.children[1].type;
        }
      }
      expect(map["/admin/home/store_items/all"]).toBe(StoreItemsPreviewHolder);
      expect(map["/admin/home/store_items/create"]).toBe(StoreItemFormHolder);
      expect(map["/admin/home/store_items/manage"]).toBe(StoreItemsManageHolder);
    });
  });
  describe("StoreItemView Component button actions", () => {
    describe("AdminStoreItemMenu", () => {
      it("Should have 3 main navigation links", () => {
        const wrapper = component.find(AdminStoreItemsMenu);
        const links = wrapper.find(Menu.Item)
        expect(links.length).toEqual(3);
      });
      it("'View All Store Items' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreItemsMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(StoreItemsPreviewHolder).length).toEqual(1);
        expect(component.find(StoreItemFormHolder).length).toEqual(0);
        expect(component.find(StoreItemsManageHolder).length).toEqual(0);
      });
      it("'Create Store Item' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreItemsMenu).find(Menu.Item).at(1);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(StoreItemsPreviewHolder).length).toEqual(0);
        expect(component.find(StoreItemFormHolder).length).toEqual(1);
        expect(component.find(StoreItemsManageHolder).length).toEqual(0);
      });
      it("'Manage Store Items' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreItemsMenu).find(Menu.Item).at(2);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(StoreItemsPreviewHolder).length).toEqual(0);
        expect(component.find(StoreItemFormHolder).length).toEqual(0);
        expect(component.find(StoreItemsManageHolder).length).toEqual(1);
      });
    });
    
  });
})