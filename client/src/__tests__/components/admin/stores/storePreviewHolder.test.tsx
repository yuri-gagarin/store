import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme"; 
import { act } from "react-dom/test-utils";
// components //
import StorePreviewHolder from "../../../../components/admin_components/stores/store_preview/StorePreviewHolder";
import StorePreview from "../../../../components/admin_components/stores/store_preview/StorePreview";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { createMockStores } from "../../../../test_helpers/storeHelpers";
// admin routes //
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";

describe("StorePreviewHolder Component render tests", () => {
  // TEST StprePreviewHolder in its loading state //
  describe("StorePreviewHolder in 'loading' state", () => {
    let wrapper: ReactWrapper;
    beforeAll(() => {
      const mockState = generateCleanState();
      mockState.storeState.loading = true;
      wrapper = mount(
        <TestStateProvider mockState={mockState}>
          <Router keyLength={0} initialEntries={[ AdminStoreRoutes.VIEW_ALL_ROUTE  ]}>
            <StorePreviewHolder />
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
  describe("StorePreview in 'loaded' state", () => {
    let wrapper: ReactWrapper; let mockStores: IStoreData[];
    beforeAll( async () => {
      moxios.install();
      const mockState = generateCleanState();
      // set mock stores //
      mockStores = [
        {
          _id: "1",
          title: "first",
          description: "desc",
          images: [],
          createdAt: "now"
        },
        {
          _id: "2",
          title: "second",
          description: "desc",
          images: [],
          createdAt: "now"
        },
        {
          _id: "3",
          title: "third",
          description: "desc",
          images: [],
          createdAt: "now"
        }
      ];

      wrapper = mount(
         <TestStateProvider mockState={mockState}>
           <Router keyLength={0} initialEntries={[AdminStoreRoutes.VIEW_ALL_ROUTE]}>
             <StorePreviewHolder />
           </Router>
         </TestStateProvider>
      );

      await act( async () => {
        await moxios.stubRequest("/api/stores", {
          status: 200,
          response: {
            responseMsg: "All ok",
            stores: mockStores
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
    it("Should display the '#adminStorePreviewHolder'", () => {
      const adminStorePreview = wrapper.find("#adminStorePreviewHolder");
      expect(adminStorePreview.length).toEqual(1);
    });
    it(`Should display a correct (3) number of StorePreview Components`, () => {
      const storePreviewComponents = wrapper.find(StorePreview);
      expect(storePreviewComponents.length).toEqual(mockStores.length);
    });
  });
  // END TEST StorePreviewHolder in its loaded state //
});