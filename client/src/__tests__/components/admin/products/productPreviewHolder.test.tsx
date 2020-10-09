import React from "react";
import { Grid } from "semantic-ui-react"
import { MemoryRouter as Router } from "react-router-dom";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme"; 
import { act } from "react-dom/test-utils";
// components //
import ProductsPreviewHolder from "../../../../components/admin_components/products/product_preview/ProductsPreviewHolder";
import ProductPreview from "../../../../components/admin_components/products/product_preview/ProductPreview";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import ProductsControls from "../../../../components/admin_components/products/product_preview/ProductsControls";
import PopularProductsHolder from "../../../../components/admin_components/products/product_preview/popular_products/PopularProductsHolder";

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
  describe("ProductPreviewHolder in 'loading' state", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      moxios.install();
      wrapper = mount(
        <Router keyLength={0} initialEntries={["/admin/home/my_products/view_all"]}>
          <TestStateProvider>
              <ProductsPreviewHolder />
          </TestStateProvider>
        </Router>
      );

      await act( async () => {
        await moxios.stubRequest("/api/products", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            products: []
          }
        });
      });
    });
    afterAll(() => {
      moxios.uninstall();
    });
    it("Should correctly render", () => {
      expect(wrapper.find(ProductsPreviewHolder)).toMatchSnapshot();
    });
    it("Should have a LoadingScreen while 'loading == true'", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not display the '#adminProductPreviewHolder'", () => {
      const adminProductPreview = wrapper.find(Grid);
      expect(adminProductPreview.length).toEqual(0);
    }); 
    it("Should not display any ProductPreview Components", () => {
      const productPreviewComponents = wrapper.find(ProductPreview);
      expect(productPreviewComponents.length).toEqual(0);
    });

  });
  // END TEST ProductPreviewHolder in its loading state //
  // TEST ProductPreviewHolder in its loaded state //
  describe("ProductPreview in 'loaded' state", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      moxios.install();
      const mockState = generateCleanState();

      wrapper = mount(
         <TestStateProvider mockState={mockState}>
           <Router keyLength={0} initialEntries={["/admin/home/my_products/view_all"]}>
             <ProductsPreviewHolder />
           </Router>
         </TestStateProvider>
      );

      await act( async () => {
        await moxios.stubRequest("/api/products", {
          status: 200,
          response: {
            responseMsg: "All ok",
            products: products
          }
        });
      });
      moxios.uninstall();
    });
    
    it("Should correctly render initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const productsGrid = wrapper.find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1)
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(0);
    });
    it("Should correctly render the 'Service' 'Grid' after successful API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const productsGrid = wrapper.find(Grid);
      // assert correct rendering ///
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(productsGrid.length).toEqual(1);
      expect(wrapper.find(ProductsPreviewHolder)).toMatchSnapshot();

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
      const mockState = generateCleanState();

      await act( async () => {
        moxios.install();
        wrapper = mount(
          <Router keyLength={0} initialEntries={["/admin/home/my_products/view_all"]}>
            <TestStateProvider mockState={mockState}>
              <ProductsPreviewHolder />
            </TestStateProvider>
          </Router>
        );
        moxios.stubRequest("/api/products", {
          status: 500,
          response: {
            responseMsg: "Error",
            error: error
          }
        });
      });
      moxios.uninstall();
    });
    afterAll(() => {
      moxios.uninstall();
    });
    it("Should render the initial Loading Screen after an  API call", () => {
      // wrapper.update();
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const productGrid = wrapper.find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(productGrid.length).toEqual(0);
    });
    it("Should render the 'ErrorScreen' Component only", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const productGrid = wrapper.find(Grid);
      // assert correct rendering //
      expect(errorScreen.length).toEqual(1);
      expect(loadingScreen.length).toEqual(0);
      expect(productGrid.length).toEqual(0)
    });
  
    it("Should properly redispatch last API call from 'ErrorScreen' Component", async () => {
      await act( async () => {
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
      });
      // assert difference //
      expect(wrapper.find(ErrorScreen).length).toEqual(1);
    });
    it("Should NOT render the 'LoadingScreen' Component", () => {
      wrapper.update();
      // assert new render //
      const loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    })
    it("Should render the 'ProductPreviewHolder' Grid", () => {
      const previewGrid = wrapper.find(ProductsPreviewHolder).find(Grid);
      expect(previewGrid.length).toEqual(1);
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
    
  });
  
  // END TEST ProductsPreviewHolder test with API error returned //
});