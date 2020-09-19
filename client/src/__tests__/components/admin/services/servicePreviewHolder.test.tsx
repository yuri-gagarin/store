import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme"; 
import { act } from "react-dom/test-utils";
// components //
import ServicePreviewHolder from "../../../../components/admin_components/services/service_preview/ServicePreviewHolder";
import ServicePreview from "../../../../components/admin_components/services/service_preview/ServicePreview";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { createMockServices } from "../../../../test_helpers/serviceHelpers";

describe("ServicePreviewHolder Component render tests", () => {
  // TEST StprePreviewHolder in its loading state //
  describe("ServicePreviewHolder in 'loading' state", () => {
    let wrapper: ReactWrapper;
    beforeAll(() => {
      const mockState = generateCleanState();
      mockState.serviceState.loading = true;
      wrapper = mount(
        <TestStateProvider mockState={mockState}>
          <Router>
            <ServicePreviewHolder />
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
    it("Should not display the '#adminServicePreviewHolder'", () => {
      const adminServicePreview = wrapper.find("#adminServicePreviewHolder");
      expect(adminServicePreview.length).toEqual(0);
    }); 
    it("Should not display any ServicePreview Components", () => {
      const servicePreviewComponents = wrapper.find(ServicePreview);
      expect(servicePreviewComponents.length).toEqual(0);
    });

  });
  // END TEST ServicePreviewHolder in its loading state //
  // TEST ServicePreviewHolder in its loaded state //
  describe("ServicePreview in 'loaded' state", () => {
    let wrapper: ReactWrapper; const numOfServices = 5;
    beforeAll( async () => {
      moxios.install();
      const mockState = generateCleanState();
      wrapper = mount(
         <TestStateProvider mockState={mockState}>
           <Router>
             <ServicePreviewHolder />
           </Router>
         </TestStateProvider>
      );

      await act( async () => {
        await moxios.stubRequest("/api/services", {
          status: 200,
          response: {
            responseMsg: "All ok",
            services: createMockServices(5)
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
    it("Should display the '#adminServicePreviewHolder'", () => {
      const adminServicePreview = wrapper.find("#adminServicePreviewHolder");
      expect(adminServicePreview.length).toEqual(1);
    });
    it(`Should display a correct (${numOfServices}) number of ServicePreview Components`, () => {
      const servicePreviewComponents = wrapper.find(ServicePreview);
      expect(servicePreviewComponents.length).toEqual(numOfServices);
    });
  });
  // END TEST ServicePreviewHolder in its loaded state //
});