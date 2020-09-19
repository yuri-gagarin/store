import React, { ReactElement } from "react";
import { Menu } from "semantic-ui-react";
// react router //
import  { BrowserRouter as Router, Switch } from "react-router-dom";
// testing imports //
import { mount, shallow, ReactWrapper , ShallowWrapper} from "enzyme";
// component imports //
import StoreViewComponent from "../../../../components/admin_components/stores/StoreView";
import AdminStoreMenu from "../../../../components/admin_components/menus/AdminStoreMenu";
import StorePreviewHolder from "../../../../components/admin_components/stores/store_preview/StorePreviewHolder";
import { StoreFormHolder } from "../../../../components/admin_components/stores/forms/StoreFormHolder";
import { StoreManageHolder } from "../../../../components/admin_components/stores/store_manage/StoreManageHolder";
// additional dependencies //

describe("StoreView Component test", () => {
  // TEST StoreViewComponent render //
  describe("StoreView Component render test", () => {
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
      expect(map["/admin/home/my_stores/all"]).toBe(StorePreviewHolder);
      expect(map["/admin/home/my_stores/create"]).toBe(StoreFormHolder);
      expect(map["/admin/home/my_stores/manage"]).toBe(StoreManageHolder);
    });
  });
  // END StoreViewComponent render tests //
  // TEST AdminStoreMenu within component and Link button tests //
  describe("StoreView Component button actions", () => {
    let component: ReactWrapper;

    beforeAll(() => {
      component = mount(
        <Router>
          <StoreViewComponent />
        </Router>
      );
    });

    describe("AdminStoreMenu", () => {

      it("Should render Admin Store Menu", () => {
        console.log(component.find("withRouter").length)
        expect(component.find("AdminStoreMenu")).toHaveLength(1);
      });
      it("Should have 3 main navigation links", () => {
        const wrapper = component.find(AdminStoreMenu);
        const links = wrapper.find(Menu.Item)
        expect(links.length).toEqual(3);
      });
      it("'View All Stores' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(StorePreviewHolder).length).toEqual(1);
        expect(component.find(StoreFormHolder).length).toEqual(0);
        expect(component.find(StoreManageHolder).length).toEqual(0);
      });
      it("'Create Store' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreMenu).find(Menu.Item).at(1);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(StorePreviewHolder).length).toEqual(0);
        expect(component.find(StoreFormHolder).length).toEqual(1);
        expect(component.find(StoreManageHolder).length).toEqual(0);
      });
      it("'Manage Stores' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminStoreMenu).find(Menu.Item).at(2);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(StorePreviewHolder).length).toEqual(0);
        expect(component.find(StoreFormHolder).length).toEqual(0);
        expect(component.find(StoreManageHolder).length).toEqual(1);
      });

    });
  });
  // END AdminStoreMenu button tests //

});