import React from "react";
import { Grid } from "semantic-ui-react"
import { MemoryRouter as Router } from "react-router-dom";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme"; 
import { act } from "react-dom/test-utils";
// components //
import ServicePreviewHolder from "../../../../components/admin_components/services/service_preview/ServicePreviewHolder";
import ServicePreview from "../../../../components/admin_components/services/service_preview/ServicePreview";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
// state //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("ServicePreviewHolder Component render tests", () => {
  let services: IServiceData[];

  beforeAll(() => {
    services = [
      {
        _id: "1",
        name: "name",
        price: "100",
        description: "description",
        images: [],
        createdAt: "now"
      },
      {
        _id: "2",
        name: "name",
        price: "200",
        description: "description",
        images: [],
        createdAt: "now"
      }
    ]
  });
  
  // TEST ServicePreviewHolder in its loading state //
  describe("ServicePreviewHolder in 'loading' state", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      moxios.install();
      wrapper = mount(
        <Router keyLength={0} initialEntries={["/admin/home/my_services/manage"]}>
          <TestStateProvider>
              <ServicePreviewHolder />
          </TestStateProvider>
        </Router>
      );

      await act( async () => {
        await moxios.stubRequest("/api/services", {
          status: 200,
          response: {
            responseMsg: "All ok",
            services: []
          }
        });
      });
    });
    afterAll(() => {
      moxios.uninstall();
    });
    it("Should correctly render", () => {
      expect(wrapper.find(ServicePreviewHolder)).toMatchSnapshot();
    });
    it("Should have a LoadingScreen while 'loading == true'", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should NOT display the '#adminServicePreviewHolder' Grid", () => {
      const adminServicePreview = wrapper.find(Grid);
      expect(adminServicePreview.length).toEqual(0);
    }); 
    it("Should NOT display the 'ErrorScreen' component", () => {
      const adminServicePreview = wrapper.find(ErrorScreen);
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
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      moxios.install();
      const mockState = generateCleanState();

      wrapper = mount(
        <Router keyLength={0} initialEntries={["/admin/home/my_services/manage"]}>
          <TestStateProvider mockState={mockState}>
            <ServicePreviewHolder />
          </TestStateProvider>
         </Router>
      );

      await act( async () => {
        await moxios.stubRequest("/api/services", {
          status: 200,
          response: {
            responseMsg: "All ok",
            services: services
          }
        });
      });
      moxios.uninstall();
    });
    
    it("Should correctly render initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const serviceGrid = wrapper.find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1)
      expect(errorScreen.length).toEqual(0);
      expect(serviceGrid.length).toEqual(0);
    });
    it("Should correctlt render the '#adminServicePreviewHolder' Grid", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(LoadingScreen);
      const errorScreen = wrapper.find(ErrorScreen);
      const serviceGrid = wrapper.find(Grid);
      // assert correct rendering ///
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(serviceGrid.length).toEqual(1);
      expect(wrapper.find(ServicePreviewHolder)).toMatchSnapshot();
    });
    it(`Should display a correct number of ServicePreview Components`, () => {
      const servicePreviewComponents = wrapper.find(ServicePreview);
      expect(servicePreviewComponents.length).toEqual(2);
    });
  });
  
  // END TEST ServicePreviewHolder in its loaded state //
  // TEST ServicePreview Component in Error state //
  
  describe("ServicePreview Component in Error state", () => {
    let wrapper: ReactWrapper;
    const error = new Error("Error occured");

    beforeAll(async () => {
      const mockState = generateCleanState();

      await act( async () => {
        moxios.install();
        wrapper = mount(
          <Router keyLength={0} initialEntries={["/admin/home/my_services/view_all"]}>
            <TestStateProvider mockState={mockState}>
              <ServicePreviewHolder />
            </TestStateProvider>
          </Router>
        );
        moxios.stubRequest("/api/services", {
          status: 500,
          response: {
            responseMsg: "An error occured",
            error: error
          }
        })
      });
      moxios.uninstall();
    })
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should initially render the 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(ServicePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ServicePreviewHolder).find(ErrorScreen);
      const servicesGrid = wrapper.find(ServicePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(servicesGrid.length).toEqual(0);
    });
    
    it("Should initially render the 'ErrorScreen' component after rerender", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ServicePreviewHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ServicePreviewHolder).find(ErrorScreen);
      const servicesGrid = wrapper.find(ServicePreviewHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(1);
      expect(servicesGrid.length).toEqual(0);
    });
    it("Should correctly respond to '#errorScreenRetryBtn' and rerender", async () => {
      await act( async () => {
        moxios.install();
        moxios.stubRequest("/api/services", {
          status: 200,
          response: {
            responseMsg: "All ok",
            services: services
          }
        })
        const retryButton = wrapper.find("#errorScreenRetryButton");
        retryButton.at(0).simulate("click");
      });
      
    });
  });
  
});