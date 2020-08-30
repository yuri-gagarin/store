import React, { ReactElement } from "react";
import { mount, ReactWrapper } from "enzyme";
import { Menu } from "semantic-ui-react";
// component imports //
import ProductsViewComponent from "../../../../components/admin_components/products/ProductsView";
import AdminProductsMenu from "../../../../components/admin_components/menus/AdminProductsMenu";
import ProductsPreviewHolder from "../../../../components/admin_components/products/product_preview/ProductsPreviewHolder";
import ProductFormHolder from "../../../../components/admin_components/products/forms/ProductFormHolder";
import { ProductsManageHolder } from "../../../../components/admin_components/products/product_manage/ProductsManageHolder";
// additional dependencies //
import { MemoryRouter as Router, Switch } from "react-router-dom";


describe("ProductView Component test", () => {
  let component: ReactWrapper;
  beforeAll(() => {
    component = mount<{}, typeof Router>(
      <Router initialEntries={["/admin/home/my_products"]}>
        <ProductsViewComponent />
      </Router>
    );
  });
  describe("ProductView Component render test", () => {
    it("Should correctly mount", () => {
      expect(component).toBeDefined();
    });
    it("Should render Admin Product Menu", () => {
      expect(component.find("AdminProductMenu")).toHaveLength(1);
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
      expect(map["/admin/home/my_products/all"]).toBe(ProductsPreviewHolder);
      expect(map["/admin/home/my_products/create"]).toBe(ProductFormHolder);
      expect(map["/admin/home/my_products/manage"]).toBe(ProductsManageHolder);
    });
  });
  describe("ProductView Component button actions", () => {
    describe("AdminProductMenu", () => {
      it("Should have 3 main navigation links", () => {
        const wrapper = component.find(AdminProductsMenu);
        const links = wrapper.find(Menu.Item)
        expect(links.length).toEqual(3);
      });
      it("'View All Products' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminProductsMenu).find(Menu.Item).at(0);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(ProductsPreviewHolder).length).toEqual(1);
        expect(component.find(ProductFormHolder).length).toEqual(0);
        expect(component.find(ProductsManageHolder).length).toEqual(0);
      });
      it("'Create Product' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminProductsMenu).find(Menu.Item).at(1);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(ProductsPreviewHolder).length).toEqual(0);
        expect(component.find(ProductFormHolder).length).toEqual(1);
        expect(component.find(ProductsManageHolder).length).toEqual(0);
      });
      it("'Manage Products' link should properly function", () => {
        window.scrollTo = jest.fn();
        const viewAllLink = component.find(AdminProductsMenu).find(Menu.Item).at(2);
        viewAllLink.simulate("click");
        component.update();
        expect(component.find(ProductsPreviewHolder).length).toEqual(0);
        expect(component.find(ProductFormHolder).length).toEqual(0);
        expect(component.find(ProductsManageHolder).length).toEqual(1);
      });
    });
    
  });
})