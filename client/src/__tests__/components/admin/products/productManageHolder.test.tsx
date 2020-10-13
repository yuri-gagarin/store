import React from "react";
import { Grid } from "semantic-ui-react";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter as Router } from "react-router-dom";
import { AdminProductRoutes } from "../../../../routes/adminRoutes";
// components //
import ProductsManageHolder from "../../../../components/admin_components/products/product_manage/ProductsManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ProductCard from "../../../../components/admin_components/products/product_manage/ProductCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
// helpers and state //
import { TestStateProvider } from "../../../../state/Store";

describe("Product Manage Holder Tests", () => {
  let products: IProductData[];
  
  beforeAll(() => {
    products = [
      {
        _id: "1",
        name: "name",
        price: "100",
        details: "details",
        description: "description",
        images: [],
        createdAt: "now"
      },
      {
        _id: "2",
        name: "name",
        price: "200",
        details: "details",
        description: "description",
        images: [],
        createdAt: "now"
      }
    ];
  });
  
  describe("Default Component state at first render", () => {
    let wrapper: ReactWrapper; let loadingScreen: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          products: []
        }
      });

      wrapper = mount(
        <Router keyLength={0} initialEntries={[AdminProductRoutes.MANAGE_ROUTE]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </Router>
      );
      await act( async () => promise);
    });
    afterAll(() => {
      moxios.uninstall();
    }); 
    
    it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
      loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1)
    });
    it("Should NOT render the 'ErrorScreen' component", () => {
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      expect(errorScreen.length).toEqual(0);
    });
    it("Should NOT render the 'ProductsManageHolder' component 'Grid'", () => {
      const productsManageGrid = wrapper.find(ProductsManageHolder).find(Grid);
      expect(productsManageGrid.length).toEqual(0);
    });
  });
  
  //
  // mock successful API call render tests //
  describe("'ProductsManageHolder' after a successful API call", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;

    beforeAll( async () => {
      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          products: products
        }
      });
    });

    afterAll(() => {
      moxios.uninstall();
    }); 

    it("Should correctly render the initial Loading Screen", async () => {
      const promise = Promise.resolve();
      component = mount(
        <Router keyLength={0} initialEntries={["/admin/home/my_products/manage"]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </Router>
      );
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
      await act (() => promise);
    });
    it("Should not render the initial Loading Screen after the API call", async () => {
      component.update();
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should NOT render the ErrorScreen Component", () => {
      const errorScreenComponent = component.find(ErrorScreen);
      expect(errorScreenComponent.length).toEqual(0);
    });

    it("Should render the correct ProductManageHolder Component", () => {
      const productManageHolderComp = component.find(ProductsManageHolder).find(Grid);
      expect(productManageHolderComp.length).toEqual(1);
      expect(component.find(ProductsManageHolder)).toMatchSnapshot();
    });
  
    it("Should render correct number of ProductCard components", () => {
      const productCards = component.find(ProductCard);
      expect(productCards.length).toEqual(products.length);
    })
  });
  
  // END mock successfull API call render tests //
  // mock ERROR API call render tests //
  describe("State after a Error in API call", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;
    const error = new Error("Error occured");

    beforeAll(async () => {
      moxios.install();
      component = mount(
        <Router keyLength={0} initialEntries={[ AdminProductRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </Router>
      );
      await act(async () => {
        moxios.stubRequest("/api/products", {
          status: 500,
          response: {
            responseMsg: "Error here",
            error: error
          }
        });
      });
      moxios.uninstall();
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should correctly render the initial Loading Screen", () => {
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not render the initial Loading Screen after an  API call", () => {
      component.update();
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should render the ErrorScreen Component", () => {
      const errorScreenComponent = component.find(ErrorScreen);
      expect(errorScreenComponent.length).toEqual(1);
    });
    it("Should NOT render the ProductManageHolder Component", () => {
      const productManageHolderComp = component.find(ProductsManageHolder).find(Grid);
      expect(productManageHolderComp.length).toEqual(0);
    });
    it("Should NOT render ANY ProductCard components", () => {
      const productCards = component.find(ProductCard);
      expect(productCards.length).toEqual(0);
    });
    it("Should have a retry Product API call Button", () => {
      const retryButton = component.find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
    });
    it("Should correctly re-dispatch the 'getProducts' API request with the button click", async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          products: products
        }
      });
      const retryButton = component.find("#errorScreenRetryButton");
      retryButton.at(0).simulate("click");
     
      expect(component.find(LoadingScreen).length).toEqual(1);
      expect(component.find(ErrorScreen).length).toEqual(0);
      expect(component.find(ProductsManageHolder).find(ErrorScreen).length).toEqual(0);

      await act(() => promise);
    });
    it("Should correctly rerender 'ProductsManageHolder' component", () => {
      component.update();
      expect(component.find(ProductsManageHolder).find(LoadingScreen).length).toEqual(0);
      expect(component.find(ProductsManageHolder).find(ErrorScreen).length).toEqual(0);
      expect(component.find(ProductsManageHolder).find(Grid).length).toEqual(1);
    })
    it("Should render correct number of 'ProductCard' Components", () => {
      const productCards = component.find(ProductsManageHolder).find(ProductCard);
      expect(productCards.length).toEqual(products.length);
    });
  });
  // END mock successfull API call tests //
  
});