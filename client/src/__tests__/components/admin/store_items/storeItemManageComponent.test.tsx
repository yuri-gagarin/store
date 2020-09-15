import React from "react";
import moxios from "moxios";
// test dependencies
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
// routing //
import { MemoryRouter as Router } from "react-router-dom";
// components //
import StoreItemManageHolder from "../../../../components/admin_components/store_items/store_items_manage/StoreItemsManageHolder";
import StoreItemCard from "../../../../components/admin_components/store_items/store_items_manage/StoreItemCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import { createMockStoreItems } from "../../../../test_helpers/storeItemHelpers";
// helpers and state //
import { StateProvider } from "../../../../state/Store";

describe("StoreItem Manage Holder Tests", () => {
  
  describe("Default Component state at first render", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;

    beforeAll( async () => {
      moxios.install();

      component = mount(
        <Router>
          <StateProvider>
            <StoreItemManageHolder />
          </StateProvider>
        </Router>
      );

      await act( async () => {
        await moxios.stubRequest("/api/store_items", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            storeItems: []
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
    let storeItems: IStoreItemData[];

    beforeAll( async () => {
      moxios.install();
      storeItems = createMockStoreItems(5);

      component = mount(
        <Router>
          <StateProvider>
            <StoreItemManageHolder />
          </StateProvider>
        </Router>
      );
      
      await act( async () => {
        await moxios.stubRequest("/api/store_items", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            storeItems: storeItems
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
    it("Should render the correct StoreItemManageHolder Component", () => {
      const storeItemManageHolderComp = component.find("#storeItemManageHolder");
      expect(storeItemManageHolderComp.at(0)).toBeDefined();
      expect(storeItemManageHolderComp.at(0)).toMatchSnapshot();
    });
    it("Should render correct number of StoreItemCard components", () => {
      const storeItemCards = component.find(StoreItemCard);
      expect(storeItemCards.length).toEqual(storeItems.length);
    });
  });
  // END mock successfull API call render tests //
    // mock ERROR API call render tests //
  describe("State after a Error in API call", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;
    let storeItems: IStoreItemData[];

    beforeAll(async () => {
      await act(async () => {
        moxios.install();

        component = await mount(
          <Router>
            <StateProvider>
              <StoreItemManageHolder />
            </StateProvider>
          </Router>
        );

        moxios.stubRequest("/api/store_items", {
          status: 500,
          response: {
            responseMsg: "Error here",
            error: new Error("API Call Error")
          }
        });
      });

      act(() => {
        moxios.uninstall();
      });

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
    it("Should NOT render the StoreItemManageHolder Component", () => {
      const storeItemManageHolderComp = component.find("#storeItemManageHolder");
      expect(storeItemManageHolderComp.length).toEqual(0);
    });
    it("Should NOT render ANY StoreItemCard components", () => {
      const storeItemCards = component.find(StoreItemCard);
      expect(storeItemCards.length).toEqual(0);
    });
    it("Should have a retry StoreItem API call Button", () => {
      const retryButton = component.find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(2);
    });
    it("Should correctly re-dispatch the 'getStoreItems' API request with the button click", async () => {
      await act( async () => {
        storeItems = createMockStoreItems(6);

        moxios.install();
        moxios.stubRequest("/api/store_items", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            storeItems: storeItems
          }
        });

        const retryButton = component.find("#errorScreenRetryButton");
        retryButton.at(0).simulate("click");
      });
      // update component and assert correct rendering //
      component.update();
      const errorScreen = component.find(ErrorScreen);
      const storeItemManageHolderComp = component.find(StoreItemManageHolder);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemManageHolderComp.length).toEqual(1);
    });
    it("Should render correct number of 'StoreItemCard' Components", () => {
      const storeItemCards = component.find(StoreItemCard);
      expect(storeItemCards.length).toEqual(storeItems.length);
    });
  });
  // END mock successfull API call tests //
});