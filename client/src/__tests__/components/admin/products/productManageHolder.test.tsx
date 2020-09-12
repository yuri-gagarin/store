import React from "react";
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import ProductManageHolder from "../../../../components/admin_components/products/product_manage/ProductsManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ErrorComponent from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import { act } from "react-dom/test-utils";
import { createMockProducts } from "../../../../test_helpers/productHelpers";
import { StateProvider } from "../../../../state/Store";
import ProductCard from "../../../../components/admin_components/products/product_manage/ProductCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import { error } from "console";

describe("Product Manage Holder Tests", () => {
  
    describe("Default Component state at first render", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      beforeAll( async () => {
        moxios.install();
        component = mount(
          <Router>
            <StateProvider>
              <ProductManageHolder />
            </StateProvider>
          </Router>
        );

        await act( async () => {
          await moxios.stubRequest("/api/products/", {
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
        expect(component).toMatchSnapshot();
      });
      
      it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1)
      });
    });
    
    // mock successful API call render tests //
    describe("State after a successful API call", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      let products: IProductData[];

      beforeAll( async () => {
        moxios.install();
        products = createMockProducts(5);

        component = mount(
          <Router>
            <StateProvider>
              <ProductManageHolder />
            </StateProvider>
          </Router>
        );
        
        await act( async () => {
          await moxios.stubRequest("/api/products/", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              products: products
            }
          });
        });
      });

      afterAll(() => {
        moxios.uninstall();
      }); 

      it("Should correctly render the initial Loading Screen", () => {
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1);
      });
      it("Should not render the initial Loading Screen after the API call", async () => {
        act( () => {
          component.update();
        });
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(0);
      });
      it("Should NOT render the ErrorScreen Component", () => {
        const errorScreenComponent = component.find(ErrorScreen);
        expect(errorScreenComponent.length).toEqual(0);
      });
  
      it("Should render the correct ProductManageHolder Component", () => {
        const productManageHolderComp = component.find("#productManageHolder");
        expect(productManageHolderComp.at(0)).toBeDefined();
        expect(productManageHolderComp.at(0)).toMatchSnapshot();
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
      let products: IProductData[];

      beforeAll(async () => {
        await act(async () => {
          moxios.install();
          component = await mount(
            <Router>
              <StateProvider>
                <ProductManageHolder />
              </StateProvider>
            </Router>
          );
          moxios.stubRequest("/api/products/", {
            status: 500,
            response: {
              responseMsg: "Error here",
              error: new Error("API Call Error")
            }
          });
        });
        act(() => {
          moxios.uninstall();
        })
      });

      it("Should correctly render the initial Loading Screen", () => {
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1);
      });

      it("Should not render the initial Loading Screen after an  API call", () => {
        act( () => {
          component.update();
        });
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(0);
      });
      it("Should render the ErrorScreen Component", () => {
        const errorScreenComponent = component.find(ErrorScreen);
        expect(errorScreenComponent.length).toEqual(1);
      });
      
      it("Should NOT render the ProductManageHolder Component", () => {
        const productManageHolderComp = component.find("#productManageHolder");
        expect(productManageHolderComp.length).toEqual(0);
      });
    
      it("Should NOT render ANY ProductCard components", () => {
        const productCards = component.find(ProductCard);
        expect(productCards.length).toEqual(0);
      });
  
      it("Should have a retry Product API call Button", () => {
        const retryButton = component.find("#errorScreenRetryButton");
        expect(retryButton.length).toEqual(2);
      });
      
      
      it("Should correctly re-dispatch the 'getProducts' API request with the button click", async () => {
        await act( async () => {
          products = createMockProducts(6);
          moxios.install();
          moxios.stubRequest("/api/products/", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              products: products
            }
          });
          const retryButton = component.find("#errorScreenRetryButton");
          retryButton.at(0).simulate("click");
        });
        component.update()
        const errorScreen = component.find(ErrorScreen);
        const productManageHolderComp = component.find(ProductManageHolder);
        expect(errorScreen.length).toEqual(0);
        expect(productManageHolderComp.length).toEqual(1);
      });
      
      it("Should render correct number of 'ProductCard' Components", () => {
        const productCards = component.find(ProductCard);
        expect(productCards.length).toEqual(products.length);
      });
    });
    // END mock successfull API call tests //
});