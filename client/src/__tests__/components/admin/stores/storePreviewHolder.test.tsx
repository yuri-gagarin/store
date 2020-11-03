import React from "react";
import { Grid } from "semantic-ui-react";
import { mount, ReactWrapper } from "enzyme"; 
// test dependencies //
import moxios from "moxios";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Router } from "react-router-dom";
// admin routes //
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";
// components //
import StorePreviewHolder from "../../../../components/admin_components/stores/store_preview/StorePreviewHolder";
import StorePreview from "../../../../components/admin_components/stores/store_preview/StorePreview";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

// TEST StprePreviewHolder in its loading state //
  
  
describe("StorePreviewHolder Component render tests", () => {
  let mockStores: IStoreData[];
  const mockDate = new Date("1/1/2019").toString();

  beforeAll(() => {
    mockStores = [
      {
        _id: "1",
        title: "first",
        description: "description",
        images: [],
        createdAt: mockDate
      },
      {
        _id: "2",
        title: "second",
        description: "description",
        images: [],
        createdAt: mockDate
      },
      {
        _id: "3",
        title: "third",
        description: "description",
        images: [],
        createdAt: mockDate
      }
    ]
  });
  // TEST StorePreviewHolder initial render //
  describe("StorePreviewHolder in 'loading' state", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/stores", {
        status: 200,
        response: {
          responseMsg: "OK",
          stores: []
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminStoreRoutes.VIEW_ALL_ROUTE  ]}>
          <TestStateProvider>
            <StorePreviewHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterAll(() => {
      moxios.uninstall();
    });
    
    it("Should correctly render", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
    it("Should render the 'LoadingScreen' before API calls resolve", () => {
      const loadingScreen = wrapper.find(StorePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StorePreviewHolder).find(ErrorScreen);
      const storesGrid = wrapper.find(StorePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storesGrid.length).toEqual(0);
    });
    it("Should not display the '#adminStorePreviewHolder'", () => {
      const adminStorePreview = wrapper.find("#adminStorePreviewHolder");
      expect(adminStorePreview.length).toEqual(0);
    }); 
    it("Should not display any StorePreview Components", () => {
      const storePreviewComponents = wrapper.find(StorePreview);
      expect(storePreviewComponents.length).toEqual(0);
    });

  });
  // END TEST StorePreviewHolder in its loading state //
  
  // TEST StorePreviewHolder in its loaded state //
  describe("'StorePreviewHolder' component after all successful API calls", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/stores", {
        status: 200,
        response: {
          responseMsg: "All ok",
          stores: mockStores
        }
      });
     
      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[AdminStoreRoutes.VIEW_ALL_ROUTE]}>
          <TestStateProvider>
            <StorePreviewHolder />
          </TestStateProvider>
        </MemoryRouter>
      );

      await act( async () => promise);
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should correctly render initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(StorePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StorePreviewHolder).find(ErrorScreen);
      const storesGrid = wrapper.find(StorePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storesGrid.length).toEqual(0);
    });
    it("Should correctly render the'StorePreviewHolder' component 'Grid'", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StorePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StorePreviewHolder).find(ErrorScreen);
      const storesGrid = wrapper.find(StorePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(wrapper.find(StorePreviewHolder)).toMatchSnapshot();
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(storesGrid.length).toEqual(1);
    });
    it(`Should NOT change the client route ${AdminStoreRoutes.VIEW_ALL_ROUTE}`, () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreRoutes.VIEW_ALL_ROUTE);
    });
    it(`Should display a correct number of StorePreview Components`, () => {
      const storePreviewComponents = wrapper.find(StorePreviewHolder).find(StorePreview);
      expect(storePreviewComponents.length).toEqual(mockStores.length);
    });
  });
  // END TEST StorePreviewHolder with a successful API call //
  // TEST StorePReviewHolder in Error state //
  describe("'StorePreviewHolder' component in API Error state", () => {
    let wrapper: ReactWrapper;
    const error = new Error("Error occured");

    beforeAll( async () => {
      const promise = Promise.resolve();
      
      moxios.install();
      moxios.stubRequest("/api/stores", {
        status: 500,
        response: {
          responseMsg: "Oops error",
          error: error
        }
      });

      wrapper = mount(
        <MemoryRouter initialEntries={[ AdminStoreRoutes.VIEW_ALL_ROUTE ]} keyLength={0}>
          <TestStateProvider>
            <StorePreviewHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should render the 'LoadingScreen' component after an API call", () => {
      const loadingScreen = wrapper.find(StorePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StorePreviewHolder).find(ErrorScreen);
      const storesGrid = wrapper.find(StorePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storesGrid.length).toEqual(0);
    });
    it("Should ONLY render the 'ErrorScreen' component after an API error", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StorePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StorePreviewHolder).find(ErrorScreen);
      const storesGrid = wrapper.find(StorePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(1);
      expect(storesGrid.length).toEqual(0);
    });
    it(`Should NOT change the client route: ${AdminStoreRoutes.VIEW_ALL_ROUTE}`, () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreRoutes.VIEW_ALL_ROUTE);
    });
    it("Should have a retry Store API call Button", () => {
      const retryBtn = wrapper.find(StorePreviewHolder).find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryBtn.length).toEqual(1)
    });
    it("Should properly redispatch last API call from 'ErrorScreen' component, render 'LoadingScreen' component", async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/stores", {
        status: 200,
        response: {
          responseMsg: "All ok",
          stores: mockStores
        }
      });
      const retryBtn = wrapper.find(StorePreviewHolder).find(ErrorScreen).find("#errorScreenRetryButton");
      retryBtn.at(0).simulate("click");
      // await for api calls to complete //
      await act( async () => promise);
      const loadingScreen = wrapper.find(StorePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StorePreviewHolder).find(ErrorScreen);
      const storesGrid = wrapper.find(StorePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storesGrid.length).toEqual(0);
    });
    it("Should correctly rerender the 'StoresPreviewHolder' component after a successful API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StorePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StorePreviewHolder).find(ErrorScreen);
      const storesGrid = wrapper.find(StorePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(storesGrid.length).toEqual(1);
    });
    it("Should render a correct number of 'StorePreview' components", () => {
      const storePreviews = wrapper.find(StorePreviewHolder).find(StorePreview);
      expect(storePreviews.length).toEqual(mockStores.length);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreRoutes.VIEW_ALL_ROUTE);
    });
  });
  // END TEST StorePreviewHolder render tests with an API error returned //
  
});