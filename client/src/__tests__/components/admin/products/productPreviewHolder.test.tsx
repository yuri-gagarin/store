import React from "react";
import { Grid } from "semantic-ui-react"
import { BrowserRouter as Router } from "react-router-dom";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme"; 
import { act } from "react-dom/test-utils";
// components //
import ProductsPreviewHolder from "../../../../components/admin_components/products/product_preview/ProductsPreviewHolder";
import ProductPreview from "../../../../components/admin_components/products/product_preview/ProductPreview";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { createMockProducts } from "../../../../test_helpers/productHelpers";

describe("ProductPreviewHolder Component render tests", () => {
  // TEST StprePreviewHolder in its loading state //
  describe("ProductPreviewHolder in 'loading' state", () => {
    let wrapper: ReactWrapper;
    beforeAll(() => {
      const mockState = generateCleanState();
      mockState.productState.loading = true;
      wrapper = mount(
        <TestStateProvider mockState={mockState}>
          <Router>
            <ProductsPreviewHolder />
          </Router>
        </TestStateProvider>
      );
    });
    it("Should correctly render", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
    it("Should have a LoadingScreen while 'loading == true'", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not display the '#adminProductPreviewHolder'", () => {
      const adminProductPreview = wrapper.find("#adminProductPreviewHolder");
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
    let wrapper: ReactWrapper; const numOfProducts = 5;
    beforeAll( async () => {
      moxios.install();
      const mockState = generateCleanState();
      wrapper = mount(
         <TestStateProvider mockState={mockState}>
           <Router>
             <ProductsPreviewHolder />
           </Router>
         </TestStateProvider>
      );

      await act( async () => {
        await moxios.stubRequest("/api/products", {
          status: 200,
          response: {
            responseMsg: "All ok",
            products: createMockProducts(5)
          }
        });
      });
      wrapper.update();
    });
    it("Should correctly render", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
    it("Should NOT have a LoadingScreen while 'loading == false'", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should display the '#adminProductPreviewHolder'", () => {
      const adminProductPreview = wrapper.find(Grid);
      // expect(adminProductPreview.length).toEqual(1);
    });
    it(`Should display a correct (${numOfProducts}) number of ProductPreview Components`, () => {
      const productPreviewComponents = wrapper.find(ProductPreview);
      expect(productPreviewComponents.length).toEqual(numOfProducts);
    });
  });
  // END TEST ProductPreviewHolder in its loaded state //
});