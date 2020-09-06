import React from "react";
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import fetchMock from "jest-fetch-mock";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import StoreManageHolder from "../../../../components/admin_components/stores/store_manage/StoreManageHolder";
import LoadingScreen  from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import { act } from "react-dom/test-utils";
import { createMockStores } from "../../../../test_helpers/storeHelpers";
import { initialContext, StateProvider } from "../../../../state/Store";

describe("Store Manage Holder Tests", () => {
  describe("Default local state render", () => {
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Default state at first render", () => {
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
      it("Should correctly render", () => {
        expect(component).toMatchSnapshot();
      });
      it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1)
      });
    });
    
    describe("State after a successful API call", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      let stores: IStoreData[];

      beforeEach(() => {
        fetchMock.resetMocks();
      })
      
      it("Should fetch the request", async () => {
        await act(async () => {
          await mount(
            <Router>
              <StateProvider>
                <StoreManageHolder />

              </StateProvider>
            </Router>
          );
        });
        expect(fetchMock).toHaveBeenCalledWith("thisurl")
      });

      it('should display error if api request fail', async () => {
        fetchMock.mockRejectOnce();
        let comp: ReactWrapper | null;
        await act(async () => {
          comp = await mount(
            <Router>
              <StateProvider>
                <StoreManageHolder />

              </StateProvider>
            </Router>
          );
        })
        comp!.update();
    
      });
      /*
      it("Should NOT render the 'LoadingScreen' Component", () => {
        let loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(0);
      });

      it("Should render the Store Manage grid", () => {
        //console.log(component.props())
      })
      */
    });
    
  });
  
});