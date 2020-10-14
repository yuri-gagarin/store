import React, { ReactElement } from "react";
import { Menu } from "semantic-ui-react";
// react router //
import { MemoryRouter, Router, Switch } from "react-router-dom";
// testing imports //
import { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
// component imports //
import ProductsViewComponent from "../../../../components/admin_components/products/ProductsView";
import AdminProductsMenu from "../../../../components/admin_components/menus/AdminProductsMenu";
import { ProductsPreviewHolder } from "../../../../components/admin_components/products/product_preview/ProductsPreviewHolder";
import { ProductFormHolder } from "../../../../components/admin_components/products/forms/ProductFormHolder";
import { ProductsManageHolder } from "../../../../components/admin_components/products/product_manage/ProductsManageHolder";
import { AdminProductRoutes } from "../../../../routes/adminRoutes";
// additional dependencies //


describe("ProductView Component render tests", () => {
  // TEST ProductsView component render //
  describe("ProductView Component default render test", () => {
    let component: ShallowWrapper;
    beforeAll(() => {
      component = shallow(
        <ProductsViewComponent />
      );
    });
    it("Should Properly render Products View", () => {
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
      expect(map[AdminProductRoutes.VIEW_ALL_ROUTE]).toBe(ProductsPreviewHolder);
      expect(map[AdminProductRoutes.CREATE_ROUTE]).toBe(ProductFormHolder);
      expect(map[AdminProductRoutes.MANAGE_ROUTE]).toBe(ProductsManageHolder);
    });
  });
  // END ProductViewComponent render tests //
  // TEST AdminProductMenu within component and Link action tests //
  describe("ProductView Component button actions", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminProductRoutes.HOME_ROUTE ]}>
          <ProductsViewComponent />
        </MemoryRouter>
      );
    });

    describe("AdminProductMenu", () => {

      it("Should render Admin Product Menu", () => {
        expect(wrapper.find(AdminProductsMenu)).toHaveLength(1);
      });
      it("Should have 4 main navigation links", () => {
        const menuWrapper = wrapper.find(AdminProductsMenu);
        const links = menuWrapper.find(Menu.Item)
        expect(links.length).toEqual(4);
      });
      it("'View All Products' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = wrapper.find(AdminProductsMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        wrapper.update();
        // assert updated compnent //
        expect(wrapper.find(ProductsPreviewHolder).length).toEqual(1);
        expect(wrapper.find(ProductFormHolder).length).toEqual(0);
        expect(wrapper.find(ProductsManageHolder).length).toEqual(0);
      });
      it(`Should redirect to "${AdminProductRoutes.VIEW_ALL_ROUTE}" client route`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminProductRoutes.VIEW_ALL_ROUTE);
      });
      it("'Create Product' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = wrapper.find(AdminProductsMenu).find(Menu.Item).at(1);
        viewAllLink.simulate("click");
        wrapper.update();
        // assert updated wrapper //
        expect(wrapper.find(ProductsPreviewHolder).length).toEqual(0);
        expect(wrapper.find(ProductFormHolder).length).toEqual(1);
        expect(wrapper.find(ProductsManageHolder).length).toEqual(0);
      });
      it(`Should redirect to "${AdminProductRoutes.CREATE_ROUTE}" client route`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminProductRoutes.CREATE_ROUTE);
      });
      it("'Manage Products' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = wrapper.find(AdminProductsMenu).find(Menu.Item).at(2);
        viewAllLink.simulate("click");
        wrapper.update();
        // assert updated wrapper //
        expect(wrapper.find(ProductsPreviewHolder).length).toEqual(0);
        expect(wrapper.find(ProductFormHolder).length).toEqual(0);
        expect(wrapper.find(ProductsManageHolder).length).toEqual(1);
      });
      it(`Should redirect to "${AdminProductRoutes.MANAGE_ROUTE}" client route`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
      });
    });
    
  });
})