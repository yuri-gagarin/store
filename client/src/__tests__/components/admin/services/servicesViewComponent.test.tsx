import React, { ReactElement } from "react";
import { mount, ReactWrapper } from "enzyme";
import { Menu } from "semantic-ui-react";
// component imports //
import ServiceViewComponent from "../../../../components/admin_components/services/ServiceView";
import AdminServiceMenu from "../../../../components/admin_components/menus/AdminServiceMenu";
import ServicePreviewHolder from "../../../../components/admin_components/services/service_preview/ServicePreviewHolder";
import ServiceFormHolder from "../../../../components/admin_components/services/forms/ServiceFormHolder";
import { ServiceManageHolder } from "../../../../components/admin_components/services/service_manage/ServiceManageHolder";
// additional dependencies //
import { MemoryRouter as Router, Switch } from "react-router-dom";


describe("ServiceView Component test", () => {
  let component: ReactWrapper;
  beforeAll(() => {
    component = mount<{}, typeof Router>(
      <Router initialEntries={["/admin/home/my_services"]}>
        <ServiceViewComponent />
      </Router>
    );
  });
  describe("ServiceView Component render test", () => {
    it("Should Properly render Services View", () => {
      expect(component).toMatchSnapshot();
    });
    it("Should render Admin Service Menu", () => {
      expect(component.find("AdminServiceMenu")).toHaveLength(1);
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
      expect(map["/admin/home/my_services/all"]).toBe(ServicePreviewHolder);
      expect(map["/admin/home/my_services/create"]).toBe(ServiceFormHolder);
      expect(map["/admin/home/my_services/manage"]).toBe(ServiceManageHolder);
    });
  });
  describe("ServiceView Component button actions", () => {
    describe("AdminServiceMenu", () => {
      it("Should have 3 main navigation links", () => {
        const wrapper = component.find(AdminServiceMenu);
        const links = wrapper.find(Menu.Item)
        expect(links.length).toEqual(3);
      });
      it("'View All Services' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminServiceMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(ServicePreviewHolder).length).toEqual(1);
        expect(component.find(ServiceFormHolder).length).toEqual(0);
        expect(component.find(ServiceManageHolder).length).toEqual(0);
      });
      it("'Create Service' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminServiceMenu).find(Menu.Item).at(1);
        viewAllLink.simulate("click");
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
        expect(component.find(ServicePreviewHolder).length).toEqual(0);
        expect(component.find(ServiceFormHolder).length).toEqual(0);
        expect(component.find(ServiceManageHolder).length).toEqual(1);
      });
    });
    
  });
})