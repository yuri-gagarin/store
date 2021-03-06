import React from "react";
import { Grid } from "semantic-ui-react"
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme"; 
import { act } from "react-dom/test-utils";
import { MemoryRouter, Router } from "react-router-dom";
// client routes //
import { AdminProductRoutes } from "../../../../routes/adminRoutes";
// components //
import ProductsPreviewHolder from "../../../../components/admin_components/products/product_preview/ProductsPreviewHolder";
import ProductPreview from "../../../../components/admin_components/products/product_preview/ProductPreview";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import ProductsControls from "../../../../components/admin_components/products/product_preview/ProductsControls";
import PopularProductsHolder from "../../../../components/admin_components/products/product_preview/popular_products/PopularProductsHolder";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("ProductPreviewHolder Component render tests", () => {
  let products: IProductData[];

  beforeAll(() => {
    products = [
      {
        _id: "1",
        name: "name",
        price: "100",
        description: "description",
        details: "details",
        images: [],
        createdAt: "now"
      },
      {
        _id: "2",
        name: "name",
        price: "100",
        description: "description",
        details: "details",
        images: [],
        createdAt: "now"
      }
    ];
  });
  // TEST ProductsPreviewHolder in its loading state //
  describe("Default component state at first render", () => {
    let wrapper: ReactWrapper;

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
        <MemoryRouter keyLength={0} initialEntries={[AdminProductRoutes.VIEW_ALL_ROUTE]}>
          <TestStateProvider>
              <ProductsPreviewHolder />
          </TestStateProvider>
        </MemoryRouter>
      );

      await act(async () => promise);
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should render the 'LoadingScreen' component before an API call resolves", () => {
      const loadingScreen = wrapper.find(ProductsPreviewHolder).find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should NOT render the 'ErrorScreen' component", () => {
      const errorScreen = wrapper.find(ProductsPreviewHolder).find(ErrorScreen);
      expect(errorScreen.length).toEqual(0);
    });
    it("Should NOT render the '#adminProductPreviewHolder' 'Grid' ", () => {
      const adminProductPreview = wrapper.find(ProductsPreviewHolder).find(Grid);
      expect(adminProductPreview.length).toEqual(0);
    }); 
    it("Should NOT render any ProductPreview Components", () => {
      const productPreviewComponents = wrapper.find(ProductPreview);
      expect(productPreviewComponents.length).toEqual(0);
    });

  });
  // END TEST ProductPreviewHolder in its loading state //
  // TEST ProductPreviewHolder in its loaded state //
  describe("'ProductPreviewHolder' after a successful API call", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      const mockState = generateCleanState();
      moxios.stubRequest("/api/products", {
        status: 200,
        response: {
          responseMsg: "All ok",
          products: products
        }
      });

      wrapper = mount(
         <TestStateProvider mockState={mockState}>
           <MemoryRouter keyLength={0} initialEntries={[AdminProductRoutes.VIEW_ALL_ROUTE]}>
             <ProductsPreviewHolder />
           </MemoryRouter>
         </TestStateProvider>
      );

      await act( async () => promise);
    });
    afterAll(() => {
      moxios.uninstall();
    });
    
    it("Should correctly render initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(ProductsPreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsPreviewHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsPreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1)
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    });
    it("Should correctly render the 'ProductsPreviewHolder' 'Grid' after successful API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ProductsPreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsPreviewHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsPreviewHolder).find(Grid);
      // assert correct rendering ///
      expect(wrapper.find(ProductsPreviewHolder)).toMatchSnapshot();
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.VIEW_ALL_ROUTE);
    });
    it(`Should display a correct number of ProductPreview Components`, () => {
      const productPreviewComponents = wrapper.find(ProductPreview);
      expect(productPreviewComponents.length).toEqual(products.length);
    });

  });
  // END TEST ProductPreviewHolder in its loaded state //
  // TEST ProductPreviewHolder in Error state //
  describe("ProductPreview Component in Error state", () => {
    let wrapper: ReactWrapper; 
    const error = new Error("Error occured");

    beforeAll( async () => {
      const promise = Promise.resolve();
      const mockState = generateCleanState();
      moxios.install();
      moxios.stubRequest("/api/products", {
        status: 500,
        response: {
          responseMsg: "Error",
          error: error
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[AdminProductRoutes.VIEW_ALL_ROUTE]}>
          <TestStateProvider mockState={mockState}>
            <ProductsPreviewHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should render the 'LoadingScreen' component after an API call", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const productGrid = wrapper.find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productGrid.length).toEqual(0);
    });
    it("Should ONLY render the 'ErrorScreen' Component only after API error", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const productGrid = wrapper.find(Grid);
      // assert correct rendering //
      expect(errorScreen.length).toEqual(1);
      expect(loadingScreen.length).toEqual(0);
      expect(productGrid.length).toEqual(0)
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.VIEW_ALL_ROUTE);
    });
    it("Should have a retry Product API call Button", () => {
      const retryButton = wrapper.find(ProductsPreviewHolder).find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
    });
    it("Should properly redispatch last API call from 'ErrorScreen' Component", async () => {
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
      // assert difference //
      await act( async () => promise);
    });
    it("Should ONLY render the 'LoadingScreen' component after API call retry", () => {
      const loadingScreen = wrapper.find(ProductsPreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsPreviewHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsPreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    });
    
    it("Should correctly rerender the 'ProductsPreviewHolder' component after successful API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ProductsPreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ProductsPreviewHolder).find(ErrorScreen);
      const productsGrid = wrapper.find(ProductsPreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(1);
    });
    it(`Should display a correct number of ProductPreview Components`, () => {
      const productPreviewComponents = wrapper.find(ProductPreview);
      expect(productPreviewComponents.length).toEqual(2);
    });
    it("Should render 'ProductsControls' Component", () => {
      const productsControls = wrapper.find(ProductsControls);
      expect(productsControls.length).toEqual(1);
    });
    it("Should render 'PopularProductsHolder' Component", () => {
      const popularProductsHolder = wrapper.find(PopularProductsHolder);
      expect(popularProductsHolder.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminProductRoutes.VIEW_ALL_ROUTE);
    });
  });
  
  // END TEST ProductsPreviewHolder test with API error returned //
});