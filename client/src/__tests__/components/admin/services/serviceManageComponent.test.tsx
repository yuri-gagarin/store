import React from "react";
import { Grid } from "semantic-ui-react";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import ServiceManageHolder from "../../../../components/admin_components/services/service_manage/ServiceManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ServiceCard from "../../../../components/admin_components/services/service_manage/ServiceCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
// helpers and state //
import { TestStateProvider } from "../../../../state/Store";

describe("Service Manage Holder Tests", () => {
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
    ];
  });

  describe("Default Component state at first render", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;
    
    beforeAll( async () => {
      moxios.install();
      component = mount(
        <Router keyLength={0} initialEntries={["/admin/home/my_services/manage"]}>
          <TestStateProvider>
            <ServiceManageHolder />
          </TestStateProvider>
        </Router>
      );

      await act( async () => {
        await moxios.stubRequest("/api/services", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            services: []
          }
        });
      });

    });
      afterAll(() => {
      moxios.uninstall();
    }); 
    
    it("Should correctly render", () => {
      expect(component.find(ServiceManageHolder)).toMatchSnapshot();
    });
    
    it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1)
    });
  });
  
  // mock successful API call render tests //
  describe("State after a successful API call", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;

    beforeAll( async () => {
      moxios.install();
      
      component = mount(
        <Router keyLength={0} initialEntries={["/admin/home/my_services/manage"]}>
          <TestStateProvider>
            <ServiceManageHolder />
          </TestStateProvider>
        </Router>
      );
      
      await act( async () => {
        await moxios.stubRequest("/api/services", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            services: services
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
      component.update();
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should NOT render the ErrorScreen Component", () => {
      const errorScreenComponent = component.find(ErrorScreen);
      expect(errorScreenComponent.length).toEqual(0);
    });

    it("Should render the correct ServiceManageHolder Component", () => {
      const serviceManageHolderComp = component.find(ServiceManageHolder).find(Grid);
      expect(serviceManageHolderComp.length).toEqual(1);
      expect(component.find(ServiceManageHolder)).toMatchSnapshot();
    });
  
    it("Should render correct number of ServiceCard components", () => {
      const serviceCards = component.find(ServiceCard);
      expect(serviceCards.length).toEqual(services.length);
    })
  });
  // END mock successfull API call render tests //

  // mock ERROR API call render tests //
  describe("State after a Error in API call", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;

    beforeAll(async () => {
      await act(async () => {
        moxios.install();
        component = await mount(
          <Router keyLength={0} initialEntries={["/admin/home/my_services/manage"]}>
            <TestStateProvider>
              <ServiceManageHolder />
            </TestStateProvider>
          </Router>
        );
        moxios.stubRequest("/api/services", {
          status: 500,
          response: {
            responseMsg: "Error here",
            error: new Error("API Call Error")
          }
        });
      });
      moxios.uninstall();
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should correctly render the initial Loading Screen", () => {
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should not render the initial Loading Screen after an  API call", () => {
      component.update();
      loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });
    it("Should render the ErrorScreen Component", () => {
      const errorScreenComponent = component.find(ErrorScreen);
      expect(errorScreenComponent.length).toEqual(1);
    });
    
    it("Should NOT render the ServiceManageHolder Component", () => {
      const serviceManageHolderComp = component.find("#serviceManageHolder");
      expect(serviceManageHolderComp.length).toEqual(0);
    });
  
    it("Should NOT render ANY ServiceCard components", () => {
      const serviceCards = component.find(ServiceCard);
      expect(serviceCards.length).toEqual(0);
    });

    it("Should have a retry Service API call Button", () => {
      const retryButton = component.find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
    });
    
    
    it("Should correctly re-dispatch the 'getServices' API request with the button click", async () => {
      await act( async () => {
        moxios.install();
        moxios.stubRequest("/api/services", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            services: services
          }
        });
        const retryButton = component.find("#errorScreenRetryButton");
        retryButton.at(0).simulate("click");
      });
      component.update()
      const errorScreen = component.find(ErrorScreen);
      const serviceManageHolderComp = component.find(ServiceManageHolder);
      expect(errorScreen.length).toEqual(0);
      expect(serviceManageHolderComp.length).toEqual(1);
    });
    
    it("Should render correct number of 'ServiceCard' Components", () => {
      const serviceCards = component.find(ServiceCard);
      expect(serviceCards.length).toEqual(services.length);
    });
  });
  // END mock successfull API call tests //
});