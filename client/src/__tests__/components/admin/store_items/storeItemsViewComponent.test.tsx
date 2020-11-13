import React, { ReactElement } from "react";
import { Menu } from "semantic-ui-react";
import { mount, ReactWrapper } from "enzyme";
// component imports //
import StoreItemsViewComponent from "../../../../components/admin_components/store_items/StoreItemsView";
import AdminStoreItemsMenu from "../../../../components/admin_components/menus/AdminStoreItemsMenu";
import { StoreItemsPreviewHolder } from "../../../../components/admin_components/store_items/store_items_preview/StoreItemsPreviewHolder";
import { StoreItemFormContainer } from "../../../../components/admin_components/store_items/forms/StoreItemFormContainer";
// additional dependencies //
import  { BrowserRouter as Router, Switch, MemoryRouter } from "react-router-dom";
import { StoreItemsManageHolder } from "../../../../components/admin_components/store_items/store_items_manage/StoreItemsManageHolder";
import { AdminStoreItemRoutes } from "../../../../routes/adminRoutes";

describe("StoreItemView Component test", () => {
  let wrapper: ReactWrapper;
  beforeAll(() => {
    wrapper = mount<{}, typeof Router>(
      <MemoryRouter initialEntries={[AdminStoreItemRoutes.HOME_ROUTE]} keyLength={0}>
        <StoreItemsViewComponent />
      </MemoryRouter>
    );
  });
  describe("StoreItemView Component render test", () => {
    it("Should Properly render StoreItemsView", () => {
      expect(wrapper.find(StoreItemsViewComponent)).toMatchSnapshot();
    });
    it("Should render Admin StoreItem Menu", () => {
      expect(wrapper.find(AdminStoreItemsMenu)).toHaveLength(1);
    });
    it("Should render conditional routes", () => {
      expect(wrapper.find("Switch")).toHaveLength(1);
    });
    it("Should have Render three children route componets", () => {
      const switchComponent = wrapper.find(Switch);
      expect(switchComponent.props().children).toHaveLength(3);
    });
    it("Should have proper client routes and conditionally render correct Components", () => {
      const switchComponent = wrapper.find(Switch);
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
      expect(map[AdminStoreItemRoutes.VIEW_ALL_ROUTE]).toBe(StoreItemsPreviewHolder);
      expect(map[AdminStoreItemRoutes.CREATE_ROUTE]).toBe(StoreItemFormContainer);
      expect(map[AdminStoreItemRoutes.MANAGE_ROUTE]).toBe(StoreItemsManageHolder);
    });
  });
  
  describe("StoreItemView Component button actions", () => {
    describe("'click' Event on 'View All' Link", () => {
      it("Should render 'StoreItemsPreviewHolder' component", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = wrapper.find(AdminStoreItemsMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        wrapper.update();
        expect(wrapper.find(StoreItemsPreviewHolder).length).toEqual(1);
      });
      it("Should NOT render 'StoreItemFormHolder' component", () => {
        expect(wrapper.find(StoreItemFormContainer).length).toEqual(0);
      });
      it("Should NOT render 'StoreItemsManageHolder' compnent", () => {
        expect(wrapper.find(StoreItemsManageHolder).length).toEqual(0);
      });
    });
    describe("'click' Event on 'Create Store Item' Link", () => {
      it("Should render 'StoreItemsFormHolder' component", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = wrapper.find(AdminStoreItemsMenu).find(Menu.Item).at(1);
        viewAllLink.simulate("click");
        wrapper.update();
        expect(wrapper.find(StoreItemFormContainer).length).toEqual(1);
      });
      it("Should NOT render 'StoreItemsPreviewHolder' component", () => {
        expect(wrapper.find(StoreItemsPreviewHolder).length).toEqual(0);
      });
      it("Should NOT render 'StoreItemsManageHolder' component", () => {
        expect(wrapper.find(StoreItemsManageHolder).length).toEqual(0);
      });
    });
    describe("'click' Event on 'Manage Store Items' Link", () => {
      it("Should render 'StoreItemsManage' component", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = wrapper.find(AdminStoreItemsMenu).find(Menu.Item).at(2);
        viewAllLink.simulate("click");
        wrapper.update();
        expect(wrapper.find(StoreItemsManageHolder).length).toEqual(1);
      });
      it("Should NOT redner 'StoreItemsFormHolder' component", () => {
        expect(wrapper.find(StoreItemFormContainer).length).toEqual(0);
      });
      it("Should NOT redner 'StoreItemsPreviewHolder' component", () => {
        expect(wrapper.find(StoreItemsPreviewHolder).length).toEqual(0);
      });
    });
    
  });
  
});