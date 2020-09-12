import React from "react";
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import StoreManageHolder from "../../../../components/admin_components/stores/store_manage/StoreManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ErrorComponent from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import { act } from "react-dom/test-utils";
import { createMockStores } from "../../../../test_helpers/storeHelpers";
import { StateProvider } from "../../../../state/Store";
import StoreCard from "../../../../components/admin_components/stores/store_manage/StoreCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import { error } from "console";

describe("Store Manage Holder Tests", () => {
  
    describe("Default Component state at first render", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      beforeAll( async () => {
        moxios.install();
        component = mount(
          <Router>
            <StateProvider>
              <StoreManageHolder />
            </StateProvider>
          </Router>
        );

        await act( async () => {
          await moxios.stubRequest("/api/stores", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              stores: []
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
      let stores: IStoreData[];

      beforeAll( async () => {
        moxios.install();
        stores = createMockStores(5);

        component = mount(
          <Router>
            <StateProvider>
              <StoreManageHolder />
            </StateProvider>
          </Router>
        );
        
        await act( async () => {
          await moxios.stubRequest("/api/stores", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              stores: stores
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
  
      it("Should render the correct StoreManageHolder Component", () => {
        const storeManageHolderComp = component.find("#storeManageHolder");
        expect(storeManageHolderComp.at(0)).toBeDefined();
        expect(storeManageHolderComp.at(0)).toMatchSnapshot();
      });
    
      it("Should render correct number of StoreCard components", () => {
        const storeCards = component.find(StoreCard);
        expect(storeCards.length).toEqual(stores.length);
      })
    });
    // END mock successfull API call render tests //
    // mock ERROR API call render tests //
    describe("State after a Error in API call", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      let stores: IStoreData[];

      beforeAll(async () => {
        await act(async () => {
          moxios.install();
          component = await mount(
            <Router>
              <StateProvider>
                <StoreManageHolder />
              </StateProvider>
            </Router>
          );
          moxios.stubRequest("/api/stores", {
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
      
      it("Should NOT render the StoreManageHolder Component", () => {
        const storeManageHolderComp = component.find("#storeManageHolder");
        expect(storeManageHolderComp.length).toEqual(0);
      });
    
      it("Should NOT render ANY StoreCard components", () => {
        const storeCards = component.find(StoreCard);
        expect(storeCards.length).toEqual(0);
      });
  
      it("Should have a retry Store API call Button", () => {
        const retryButton = component.find("#errorScreenRetryButton");
        expect(retryButton.length).toEqual(2);
      });
      
      
      it("Should correctly re-dispatch the 'getStores' API request with the button click", async () => {
        await act( async () => {
          stores = createMockStores(6);
          moxios.install();
          moxios.stubRequest("/api/stores", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              stores: stores
            }
          });
          const retryButton = component.find("#errorScreenRetryButton");
          retryButton.at(0).simulate("click");
        });
        component.update()
        const errorScreen = component.find(ErrorScreen);
        const storeManageHolderComp = component.find(StoreManageHolder);
        expect(errorScreen.length).toEqual(0);
        expect(storeManageHolderComp.length).toEqual(1);
      });
      
      it("Should render correct number of 'StoreCard' Components", () => {
        const storeCards = component.find(StoreCard);
        expect(storeCards.length).toEqual(stores.length);
      });
    });
    // END mock successfull API call tests //
    
  
});