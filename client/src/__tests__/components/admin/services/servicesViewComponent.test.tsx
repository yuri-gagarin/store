import React, { ReactElement } from "react";
import { Menu } from "semantic-ui-react";
// testing imports //
import { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
// react router //
import { MemoryRouter as Router, Switch } from "react-router-dom";
import { AdminServiceRoutes } from "../../../../routes/adminRoutes";
// component imports //
import ServiceViewComponent from "../../../../components/admin_components/services/ServiceView";
import AdminServiceMenu from "../../../../components/admin_components/menus/AdminServiceMenu";
import { ServicePreviewHolder } from "../../../../components/admin_components/services/service_preview/ServicePreviewHolder";
import { ServiceFormHolder } from "../../../../components/admin_components/services/forms/ServiceFormHolder";
import { ServiceManageHolder } from "../../../../components/admin_components/services/service_manage/ServiceManageHolder";
// additional dependencies //


describe("ServiceView Component render tests", () => {
  // TEST ServiceView Component render //
  describe("ServiceView Component default render test", () => {
    let component: ShallowWrapper;

    beforeAll(() => {
      component = shallow(
        <ServiceViewComponent />
      );
    });

    it("Should Properly render Services View", () => {
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
      expect(map[AdminServiceRoutes.VIEW_ALL_ROUTE]).toBe(ServicePreviewHolder);
      expect(map[AdminServiceRoutes.CREATE_ROUTE]).toBe(ServiceFormHolder);
      expect(map[AdminServiceRoutes.MANAGE_ROUTE]).toBe(ServiceManageHolder);
    });
  });
  // END ServicesViewComponent default render tests //
  // TEST AdminServiceMenu within component and Link button tets //
  describe("ServiceView Component button actions", () => {
    let component: ReactWrapper;

    beforeAll(() => {
      component = mount(
        <Router keyLength={0} initialEntries={ [AdminServiceRoutes.HOME_ROUTE] }>
          <ServiceViewComponent />
        </Router>
      );
    });

    describe("AdminServiceMenu", () => {

      it("Should render AdminServiceMenu component", () => {
        expect(component.find(AdminServiceMenu)).toHaveLength(1);
      });
      it("Should have 3 main navigation links", () => {
        const wrapper = component.find(AdminServiceMenu);
        const links = wrapper.find(Menu.Item)
        expect(links.length).toEqual(4);
      });
      it("'View All Services' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminServiceMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        component.update();
        // assert updated component //
        expect(component.find(ServicePreviewHolder).length).toEqual(1);
        expect(component.find(ServiceFormHolder).length).toEqual(0);
        expect(component.find(ServiceManageHolder).length).toEqual(0);
      });
      it("'Create Service' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminServiceMenu).find(Menu.Item).at(1);
        viewAllLink.simulate("click");
        // assert updated component //
        component.update();
        expect(component.find(ServicePreviewHolder).length).toEqual(0);
        expect(component.find(ServiceFormHolder).length).toEqual(1);
        expect(component.find(ServiceManageHolder).length).toEqual(0);
      });
      it("'Manage Services' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminServiceMenu).find(Menu.Item).at(2);
        viewAllLink.simulate("click");
        component.update();
        // assert updated component //
        expect(component.find(ServicePreviewHolder).length).toEqual(0);
        expect(component.find(ServiceFormHolder).length).toEqual(0);
        expect(component.find(ServiceManageHolder).length).toEqual(1);
      });

    });
  });
  // END AdminServiceMenu link tets //

});