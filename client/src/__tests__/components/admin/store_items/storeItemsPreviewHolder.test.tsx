import React from "react";
import { Grid } from "semantic-ui-react"
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme"; 
import { act } from "react-dom/test-utils";
import { MemoryRouter, Router } from "react-router-dom";
// client routes //
import { AdminStoreItemRoutes } from "../../../../routes/adminRoutes";
// components //
import StoreItemsPreviewHolder from "../../../../components/admin_components/store_items/store_items_preview/StoreItemsPreviewHolder";
import StoreItemPreview from "../../../../components/admin_components/store_items/store_items_preview/StoreItemPreview";
import PopularStoreItemsHolder from "../../../../components/admin_components/store_items/store_items_preview/popular_store_items/PopularStoreItemsHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import StoreItemsControls from "../../../../components/admin_components/store_items/store_items_preview/StoreItemsControls"
// import PopularStoreItemsHolder from "../../../../components/admin_components/storeItems/storeItem_preview/popular_storeItems/PopularStoreItemsHolder";

describe("StoreItemPreviewHolder Component render tests", () => {
  let storeItems: IStoreItemData[];
  let mockStore: IStoreData;
  const date = new Date("1/1/2019").toString();

  beforeAll(() => {
    mockStore = {
      _id: "1",
      title: "store",
      description: "description",
      images: [],
      createdAt: date
    };
    storeItems = [
      {
        _id: "1",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "first",
        price: "100",
        details: "details",
        description: "description",
        categories: ["sports", "outdoors"],
        images: [],
        createdAt: date
      },
      {
        _id: "2",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "second",
        price: "200",
        details: "details",
        description: "description",
        categories: ["sports", "outdoors", "camping"],
        images: [],
        createdAt: date
      }
    ];
  });
  // TEST StoreItemsPreviewHolder in its loading state //
  describe("Default component state at first render", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          storeItems: []
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[AdminStoreItemRoutes.VIEW_ALL_ROUTE]}>
          <TestStateProvider>
              <StoreItemsPreviewHolder />
          </TestStateProvider>
        </MemoryRouter>
      );

      await act(async () => promise);
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should render the 'LoadingScreen' component before an API call resolves", () => {
      const loadingScreen = wrapper.find(StoreItemsPreviewHolder).find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should NOT render the 'ErrorScreen' component", () => {
      const errorScreen = wrapper.find(StoreItemsPreviewHolder).find(ErrorScreen);
      expect(errorScreen.length).toEqual(0);
    });
    it("Should NOT render the '#adminStoreItemPreviewHolder' 'Grid' ", () => {
      const adminStoreItemPreview = wrapper.find(StoreItemsPreviewHolder).find(Grid);
      expect(adminStoreItemPreview.length).toEqual(0);
    }); 
    it("Should NOT render any StoreItemPreview Components", () => {
      const storeItemPreviewComponents = wrapper.find(StoreItemPreview);
      expect(storeItemPreviewComponents.length).toEqual(0);
    });

  });
  // END TEST StoreItemPreviewHolder in its loading state //
  // TEST StoreItemPreviewHolder in its loaded state //
  describe("'StoreItemPreviewHolder' after a successful API call", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      const mockState = generateCleanState();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: storeItems
        }
      });

      wrapper = mount(
         <TestStateProvider mockState={mockState}>
           <MemoryRouter keyLength={0} initialEntries={[AdminStoreItemRoutes.VIEW_ALL_ROUTE]}>
             <StoreItemsPreviewHolder />
           </MemoryRouter>
         </TestStateProvider>
      );

      await act( async () => promise);
    });
    afterAll(() => {
      moxios.uninstall();
    })
    
    it("Should correctly render initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(StoreItemsPreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsPreviewHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsPreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1)
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(0);
    });
    it("Should correctly render the 'StoreItemsPreviewHolder' 'Grid' after successful API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StoreItemsPreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsPreviewHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsPreviewHolder).find(Grid);
      // assert correct rendering ///
      expect(wrapper.find(StoreItemsPreviewHolder).find(StoreItemsPreviewHolder)).toMatchSnapshot();
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.VIEW_ALL_ROUTE);
    });
    it(`Should display a correct number of StoreItemPreview Components`, () => {
      const storeItemPreviewComponents = wrapper.find(StoreItemPreview);
      expect(storeItemPreviewComponents.length).toEqual(storeItems.length);
    });

  });
  // END TEST StoreItemPreviewHolder in its loaded state //
  // TEST StoreItemPreviewHolder in Error state //
  describe("StoreItemPreview Component in Error state", () => {
    let wrapper: ReactWrapper; 
    const error = new Error("Error occured");

    beforeAll( async () => {
      const promise = Promise.resolve();
      const mockState = generateCleanState();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 500,
        response: {
          responseMsg: "Error",
          error: error
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[AdminStoreItemRoutes.VIEW_ALL_ROUTE]}>
          <TestStateProvider mockState={mockState}>
            <StoreItemsPreviewHolder />
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
      const storeItemGrid = wrapper.find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemGrid.length).toEqual(0);
    });
    it("Should ONLY render the 'ErrorScreen' Component only after API error", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const storeItemGrid = wrapper.find(Grid);
      // assert correct rendering //
      expect(errorScreen.length).toEqual(1);
      expect(loadingScreen.length).toEqual(0);
      expect(storeItemGrid.length).toEqual(0)
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.VIEW_ALL_ROUTE);
    });
    it("Should have a retry StoreItem API call Button", () => {
      const retryButton = wrapper.find(StoreItemsPreviewHolder).find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
    });
    it("Should properly redispatch last API call from 'ErrorScreen' Component", async () => {
      const promise = Promise.resolve();

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
      // assert difference //
      await act( async () => promise);
    });
    it("Should ONLY render the 'LoadingScreen' component after API call retry", () => {
      const loadingScreen = wrapper.find(StoreItemsPreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsPreviewHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsPreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(0);
    });
    
    it("Should correctly rerender the 'StoreItemsPreviewHolder' component after successful API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StoreItemsPreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsPreviewHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsPreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(1);
    });
    it(`Should display a correct number of StoreItemPreview Components`, () => {
      const storeItemPreviewComponents = wrapper.find(StoreItemPreview);
      expect(storeItemPreviewComponents.length).toEqual(2);
    });
    it("Should render 'StoreItemsControls' Component", () => {
      const storeItemsControls = wrapper.find(StoreItemsControls);
      expect(storeItemsControls.length).toEqual(1);
    });
    it("Should render 'PopularStoreItemsHolder' Component", () => {
      const popularStoreItemsHolder = wrapper.find(PopularStoreItemsHolder);
      expect(popularStoreItemsHolder.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.VIEW_ALL_ROUTE);
    });
  });
  
  // END TEST StoreItemsPreviewHolder test with API error returned //
});