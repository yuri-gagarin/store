import React from "react";
import { Grid } from "semantic-ui-react";
import moxios from "moxios";
// test dependencies
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
// routing //
import { MemoryRouter, Router } from "react-router-dom";
import { AdminStoreItemRoutes } from "../../../../routes/adminRoutes";
// components //
import StoreItemsManageHolder from "../../../../components/admin_components/store_items/store_items_manage/StoreItemsManageHolder";
import StoreItemCard from "../../../../components/admin_components/store_items/store_items_manage/StoreItemCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import { createMockStoreItems } from "../../../../test_helpers/storeItemHelpers";
// helpers and state //
import { TestStateProvider } from "../../../../state/Store";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { StoreItemFormHolder } from "../../../../components/admin_components/store_items/forms/StoreItemFormHolder";

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
          storeItems: []
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

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      })
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

    it("Should correctly render the initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(0);
    });
    it("Should correctly render the 'StoreItemsManageHold' 'Grid' after a 'successful' API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(wrapper.find(StoreItemsManageHolder)).toMatchSnapshot();
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.MANAGE_ROUTE);
    })
    it("Should render correct number of StoreItemCard components", () => {
      const storeItemCards = wrapper.find(StoreItemCard);
      expect(storeItemCards.length).toEqual(mockStoreItems.length);
    });
  });
  // END mock successfull API call render tests //
  // mock ERROR API call render tests //
  describe("State after a Error in API call", () => {
    let wrapper: ReactWrapper;
    const error = new Error("An error occured");

    beforeAll(async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 500,
        response: {
          responseMsg: "Error",
          error: error
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminStoreItemRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <StoreItemsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should correctly render the 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const servicesGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(servicesGrid.length).toEqual(0);
    });
    it("Should ONLY render the 'ErrorScreen' component afert API error", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeITemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);      
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(1);
      expect(storeITemsGrid.length).toEqual(0);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.MANAGE_ROUTE);
    });
    it("Should have a retry StoreItem API call Button", () => {
      const retryButton = wrapper.find(StoreItemsManageHolder).find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
    });
    it("Should correctly re-dispatch the 'getStoreItems' API request with the button click", async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          storeItems: mockStoreItems
        }
      });
      const retryButton = wrapper.find("#errorScreenRetryButton");
      retryButton.at(0).simulate("click");

      await act(() => promise);
    });
    it("Should render ONLY 'LoadingScreen' component after API call retry", () => {
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(0);
    })
    it("Should correctly rerender 'StoreItemsManageHolder' component", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(1);
    });
    it("Should render a correct number of 'ProductCard' components", () => {
      const storeItemsCatds = wrapper.find(StoreItemsManageHolder).find(StoreItemCard);
      expect(storeItemsCatds.length).toEqual(mockStoreItems.length);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.MANAGE_ROUTE);
    });
  });
  // TEST StoreItemCard EDIT button click //
  describe("'StoreItemCard' component EDIT button click action", () => {
    let wrapper: ReactWrapper;
    let editWrapper: ReactWrapper;
    window.scrollTo = jest.fn();

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
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
      wrapper.update();
    });
    it("Should render the 'StoreItemFormHolder' component after 'edit' Button click action", () => {
      const editButton = wrapper.find(StoreItemCard).at(0).find(".storeItemCardEditBtn").at(0);
      editButton.simulate("click");
      const storeItmFormHold = wrapper.find(StoreItemFormHolder);
      expect(storeItmFormHold.length).toEqual(1);
    });
    it("Should display the in '#storeItemFormHolderDetailsHolder' component", () => {
      const detailsHolder = wrapper.find(StoreItemFormHolder).render().find("#storeItemFormHolderDetailsHolder");
      expect(detailsHolder.length).toEqual(1);
    })
  })
  // END mock successfull API call tests //
});