import React from "react";
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import StoreManageHolder from "../../../../components/admin_components/stores/store_manage/StoreManageHolder";
import LoadingScreen  from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import { act } from "react-dom/test-utils";
import { createMockStores } from "../../../../test_helpers/storeHelpers";
import { initialContext, StateProvider } from "../../../../state/Store";
import StoreCard from "../../../../components/admin_components/stores/store_manage/StoreCard";

describe("Store Manage Holder Tests", () => {
  describe("Default local state render", () => {
    /*
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });
    */
    describe("Default Component state at first render", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      beforeAll(() => {
        component = mount(
          <Router>
            <StateProvider>
              <StoreManageHolder />
            </StateProvider>
          </Router>
        )
      });
      /*
      it("Should correctly render", () => {
        expect(component).toMatchSnapshot();
      });
      */
      it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1)
      });
    });
    
    // mock successful API call tests //
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
          await moxios.stubRequest("/api/stores/", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              stores: stores
            }
          });
        });
        
        /*
        await moxios.wait(jest.fn);
        await act(async() => {
          const request = moxios.requests.mostRecent();
          await request.respondWith({
            response: {
              responseMsg: "All ok",
              stores: stores
            }
          });
        });
        */
      });

      afterAll(() => {
        moxios.uninstall();
      }); 

      /*
      it("Should correctly render the initial Loading Screen", () => {
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1);
      });
      */

      it("Should not render the initial Loading Screen after a successful API call", () => {
        act(() => {
          component.update();
        });
        loadingScreen = component.find(LoadingScreen);
        expect(LoadingScreen.length).toEqual(0);
      });

      it("Should render the correct StoreManageHolder Component", () => {
        const storeManageHolderComp = component.find("#storeManageHolder");
        expect(storeManageHolderComp.at(0)).toBeDefined();
        expect(storeManageHolderComp.at(0)).toMatchSnapshot();
      });

      it("Should properly render all StoreCard components", () => {
        const storeCards = component.find(StoreCard);
        expect(storeCards.length).toEqual(stores.length);
      })
    });
    // END mock successfull API call tests //
    
  });
  
});