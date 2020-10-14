import React from "react";
import { Grid } from "semantic-ui-react";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Router } from "react-router-dom";
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
        <MemoryRouter keyLength={0} initialEntries={[AdminProductRoutes.MANAGE_ROUTE]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
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
    let wrapper: ReactWrapper; 

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          products: products
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminProductRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );

      await act( async () => promise);
    });

    afterAll(() => {
      moxios.uninstall();
    }); 

    it("Should correctly render the initial 'LoadingScreen' compnent", async () => {
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    });
    it("Should correctly render the 'ProductsManageHolder' 'Grid' after successful API call", async () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(wrapper.find(ProductsManageHolder)).toMatchSnapshot();
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
    });
    it("Should render correct number of ProductCard components", () => {
      const productCards = wrapper.find(ProductsManageHolder).find(ProductCard);
      expect(productCards.length).toEqual(products.length);
    });

  });
  
  // END mock successfull API call render tests //
  // mock ERROR API call render tests //
  describe("'ProductsManageHolder' component after a Error in API call", () => {
    let wrapper: ReactWrapper; 
    const error = new Error("Error occured");

    beforeAll(async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 500,
        response: {
          responseMsg: "Error here",
          error: error
        }
      });
      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminProductRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <ProductsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should correctly render the 'LoadingScreen' component after an API call", () => {
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    });

    it("Should ONLY render the 'ErrorScreen' component afert API error", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);      
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(1);
      expect(productsGrid.length).toEqual(0);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
    });
    it("Should have a retry Product API call Button", () => {
      const retryButton = wrapper.find(ProductsManageHolder).find(ErrorScreen).render().find("#errorScreenRetryButton");
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
      const retryButton = wrapper.find("#errorScreenRetryButton");
      retryButton.at(0).simulate("click");

      await act(() => promise);
    });
    it("Should render ONLY 'LoadingScreen' component after API call retry", () => {
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    })
    it("Should correctly rerender 'ProductsManageHolder' component", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ProductsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsManageHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(1);
    });
    it("Should render a correct number of 'ProductCard' components", () => {
      const productCards = wrapper.find(ProductsManageHolder).find(ProductCard);
      expect(productCards.length).toEqual(products.length);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.MANAGE_ROUTE);
    });
  });
  // END mock successfull API call tests //
  
});