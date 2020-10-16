import React from "react";
import { Grid } from "semantic-ui-react";
import moxios from "moxios";
// test dependencies
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
// routing //
import { MemoryRouter } from "react-router-dom";
import { AdminStoreItemRoutes } from "../../../../routes/adminRoutes";
// components //
import StoreItemsManageHolder from "../../../../components/admin_components/store_items/store_items_manage/StoreItemsManageHolder";
import StoreItemCard from "../../../../components/admin_components/store_items/store_items_manage/StoreItemCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import { createMockStoreItems } from "../../../../test_helpers/storeItemHelpers";
// helpers and state //
import { TestStateProvider } from "../../../../state/Store";

describe("StoreItem Manage Holder Tests", () => {
  const mockDate: string = new Date("12/31/2019").toString();
  let mockStoreItems: IStoreItemData[];
  let mockStore: IStoreData;

  beforeAll(() => {
    mockStore = {
      _id:"1111",
      title: "title",
      description: "description",
      images: [],
      createdAt: mockDate
    };

    mockStoreItems = [
      {
        _id: "1",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "first",
        price: "100",
        details: "details",
        description: "description",
        categories: [],
        images: [],
        createdAt: mockDate
      },
      {
        _id: "2",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "second",
        price: "200",
        details: "details",
        description: "description",
        categories: [],
        images: [],
        createdAt: mockDate
      },
      {
        _id: "3",
        storeId: mockStore._id,
        storeName: mockStore._id,
        name: "third",
        price: "300",
        details: "details",
        description: "description",
        categories: [],
        images: [],
        createdAt: mockDate
      }
    ];
  });
  
  describe("Default Component state at first render", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All ok",
          products: []
        }
      });

      wrapper = mount(
        <MemoryRouter initialEntries={[AdminStoreItemRoutes.MANAGE_ROUTE]} keyLength={0}>
          <TestStateProvider>
            <StoreItemsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });

    afterAll(() => {
      moxios.uninstall();
    }); 
    
    it("Should render the 'LoadingScreen' component before an API call completes", () => {
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should NOT render the 'ErrorScreen' component", () => {
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      expect(errorScreen.length).toEqual(0);
    });
    it("Should NOT render the 'Store Items' Grid", () => {
      expect(wrapper.find(Grid).length).toEqual(0);
    })
  });
    
  // mock successful API call render tests //
  describe("State after a successful API call", () => {
    let wrapper: ReactWrapper; let loadingScreen: ReactWrapper;
    let storeItems: IStoreItemData[];

    beforeAll( async () => {
      moxios.install();
      storeItems = createMockStoreItems(5);

      wrapper = mount(
        <Router initialEntries={[AdminStoreItemRoutes.MANAGE_ROUTE]} keyLength={0}>
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
      loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not render the initial Loading Screen after the API call", async () => {
      act( () => {
        wrapper.update();
      });
      loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should NOT render the ErrorScreen Component", () => {
      const errorScreenComponent = wrapper.find(ErrorScreen);
      expect(errorScreenComponent.length).toEqual(0);
    });
    it("Should render the correct StoreItemManageHolder Component", () => {
      const storeItemManageHolderComp = wrapper.find(StoreItemManageHolder).find(Grid);
      expect(storeItemManageHolderComp.length).toEqual(1);
    });
    it("Should render correct number of StoreItemCard components", () => {
      const storeItemCards = wrapper.find(StoreItemCard);
      expect(storeItemCards.length).toEqual(storeItems.length);
    });
  });
  // END mock successfull API call render tests //
    // mock ERROR API call render tests //
  describe("State after a Error in API call", () => {
    let wrapper: ReactWrapper; let loadingScreen: ReactWrapper;
    let storeItems: IStoreItemData[];

    beforeAll(async () => {
      await act(async () => {
        moxios.install();

        wrapper = await mount(
          <Router initialEntries={[AdminStoreItemRoutes.HOME_ROUTE]} keyLength={0}>
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
      loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not render the initial Loading Screen after an  API call", () => {
      act( () => {
        wrapper.update();
      });
      loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should render the ErrorScreen Component", () => {
      const errorScreenComponent = wrapper.find(ErrorScreen);
      expect(errorScreenComponent.length).toEqual(1);
    });
    it("Should NOT render the StoreItemManageHolder Component", () => {
      const storeItemManageHolderComp = wrapper.find(Grid);
      expect(storeItemManageHolderComp.length).toEqual(0);
    });
    it("Should NOT render ANY StoreItemCard components", () => {
      const storeItemCards = wrapper.find(StoreItemCard);
      expect(storeItemCards.length).toEqual(0);
    });
    it("Should have a retry StoreItem API call Button", () => {
      const retryButton = wrapper.find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
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

        const retryButton = wrapper.find("#errorScreenRetryButton");
        retryButton.at(0).simulate("click");
      });
      // update component and assert correct rendering //
      wrapper.update();
      const errorScreen = wrapper.find(ErrorScreen);
      const storeItemManageHolderComp = wrapper.find(StoreItemManageHolder);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemManageHolderComp.length).toEqual(1);
    });
    it("Should render correct number of 'StoreItemCard' Components", () => {
      const storeItemCards = wrapper.find(StoreItemCard);
      expect(storeItemCards.length).toEqual(storeItems.length);
    });
  });
  // END mock successfull API call tests //
});