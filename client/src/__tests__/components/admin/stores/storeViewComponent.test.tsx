import React, { ReactElement } from "react";
import { Menu } from "semantic-ui-react";
// react router //
import  { MemoryRouter as Router, Switch } from "react-router-dom";
// testing imports //
import { mount, shallow, ReactWrapper , ShallowWrapper} from "enzyme";
// component imports //
import StoreViewComponent from "../../../../components/admin_components/stores/StoreView";
import AdminStoreMenu from "../../../../components/admin_components/menus/AdminStoreMenu";
import { StorePreviewHolder } from "../../../../components/admin_components/stores/store_preview/StorePreviewHolder";
import { StoreFormContainer } from "../../../../components/admin_components/stores/forms/StoreFormContainer";
import { StoreManageHolder } from "../../../../components/admin_components/stores/store_manage/StoreManageHolder";
// additional dependencies //
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";

describe("StoreView Component render tests", () => {
  // TEST StoreViewComponent render //
  describe("StoreView Component default render test", () => {
    let component: ShallowWrapper;
    beforeAll(() => {
      component = shallow(
        <StoreViewComponent />
      );
    });
    it("Should Properly render StoreView", () => {
      expect(component).toMatchSnapshot();
    });
    it("Should render conditional routes", () => {
      expect(component.find(Switch)).toHaveLength(1);
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
      expect(map[AdminStoreRoutes.VIEW_ALL_ROUTE]).toBe(StorePreviewHolder);
      expect(map[AdminStoreRoutes.CREATE_ROUTE]).toBe(StoreFormContainer);
      expect(map[AdminStoreRoutes.MANAGE_ROUTE]).toBe(StoreManageHolder);
    });
  });
  // END StoreViewComponent render tests //
  // TEST AdminStoreMenu within component and Link button tests //
  describe("StoreView Component button actions", () => {
    let component: ReactWrapper;

    beforeAll(() => {
      component = mount(
        <Router initialEntries={ [AdminStoreRoutes.HOME_ROUTE] } keyLength={0}>
          <StoreViewComponent />
        </Router>
      );
    });

    describe("AdminStoreMenu", () => {

      it("Should render Admin Store Menu", () => {
        expect(component.find(AdminStoreMenu)).toHaveLength(1);
      });
      it("'View All Stores' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        component.update();
        // assert updated component //
        expect(component.find(StorePreviewHolder).length).toEqual(1);
        expect(component.find(StoreFormContainer).length).toEqual(0);
        expect(component.find(StoreManageHolder).length).toEqual(0);
      });
      it("'Create Store' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreMenu).find(Menu.Item).at(1);
        viewAllLink.simulate("click");
        component.update();
        // assert updated component //
        expect(component.find(StorePreviewHolder).length).toEqual(0);
        expect(component.find(StoreFormContainer).length).toEqual(1);
        expect(component.find(StoreManageHolder).length).toEqual(0);
      });
      it("'Manage Stores' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreMenu).find(Menu.Item).at(2);
        viewAllLink.simulate("click");
        component.update();
        // assert updated component //
        expect(component.find(StorePreviewHolder).length).toEqual(0);
        expect(component.find(StoreFormContainer).length).toEqual(0);
        expect(component.find(StoreManageHolder).length).toEqual(1);
      });

    });
  });
  // END AdminStoreMenu button tests //

});