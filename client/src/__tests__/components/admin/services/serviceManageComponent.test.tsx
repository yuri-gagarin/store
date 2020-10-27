import React from "react";
import { Grid } from "semantic-ui-react";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Router } from "react-router-dom";
import { AdminServiceRoutes } from "../../../../routes/adminRoutes";
// components //
import ServiceManageHolder from "../../../../components/admin_components/services/service_manage/ServiceManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ServiceCard from "../../../../components/admin_components/services/service_manage/ServiceCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import { ServiceFormHolder } from "../../../../components/admin_components/services/forms/ServiceFormHolder";
import ServiceForm from "../../../../components/admin_components/services/forms/ServiceForm";
// helpers and state //
import { TestStateProvider } from "../../../../state/Store";

describe("Service Manage Holder Tests", () => {
  let mockDate: string = new Date("12/31/2019").toString();
  let mockServices: IServiceData[];

  beforeAll(() => {
    mockServices = [
      {
        _id: "1",
        name: "first",
        price: "100",
        description: "description",
        images: [],
        createdAt: mockDate
      },
      {
        _id: "2",
        name: "second",
        price: "200",
        description: "description",
        images: [],
        createdAt: mockDate
      },
      {
        _id: "3",
        name: "third",
        price: "300",
        description: "description",
        images: [],
        createdAt: mockDate
      }
    ];
  });

  describe("Default Component state at first render", () => {
    let wrapper: ReactWrapper; let loadingScreen: ReactWrapper;
    
    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/services", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          services: []
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[AdminServiceRoutes.MANAGE_ROUTE]}>
          <TestStateProvider>
            <ServiceManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });

    afterAll(() => {
      moxios.uninstall();
    }); 
    
    it("Should render the 'LoadingScreen' component before an API call resolves", () => {
      const loadingScreen = wrapper.find(ServiceManageHolder).find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should NOT render the 'ErrorScreenComponent", () => {
      const errorScreen = wrapper.find(ServiceManageHolder).find(ErrorScreen);
      expect(errorScreen.length).toEqual(0);
    });
    it("Should NOT render the 'ServiceItems' 'Grid' component", () => {
      const serviceItemsGrid = wrapper.find(ServiceManageHolder).find(Grid);
      expect(serviceItemsGrid.length).toEqual(0);
    });
  });
  
  // mock successful API call render tests //
  describe("State after a successful API call", () => {
    let wrapper: ReactWrapper; let loadingScreen: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/services", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          services: mockServices
        }
      });
      
      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminServiceRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <ServiceManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      
      await act( async() => promise);
    });

    afterAll(() => {
      moxios.uninstall();
    }); 

    it("Should correctly render the initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(ServiceManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ServiceManageHolder).find(ErrorScreen);
      const servicesGrid = wrapper.find(ServiceManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(servicesGrid.length).toEqual(0);
    });
    it("Should correctly render the 'ServicesManageHolder' 'Grid' component after a 'successful' API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ServiceManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ServiceManageHolder).find(ErrorScreen);
      const servicesGrid = wrapper.find(ServiceManageHolder).find(Grid);
      // assert correct rendering //
      expect(wrapper.find(ServiceManageHolder)).toMatchSnapshot();
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(servicesGrid.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminServiceRoutes.MANAGE_ROUTE);
    })
  
    it("Should render correct number of ServiceCard components", () => {
      const serviceCards = wrapper.find(ServiceCard);
      expect(serviceCards.length).toEqual(mockServices.length);
    })
  });
  // END mock successfull API call render tests //
  // mock ERROR API call render tests //
  describe("State after a Error in API call", () => {
    let wrapper: ReactWrapper; 
    const error = new Error("An error occured");

    beforeAll(async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/services", {
        status: 500,
        response: {
          responseMsg: "Error here",
          error: new Error("API Call Error")
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminServiceRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <ServiceManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should correctly render the 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(ServiceManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ServiceManageHolder).find(ErrorScreen);
      const servicesGrid = wrapper.find(ServiceManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(servicesGrid.length).toEqual(0);
    });
    it("Should ONLY render the 'ErrorScreen' component after an API call error", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(ServiceManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ServiceManageHolder).find(ErrorScreen);
      const servicesGrid = wrapper.find(ServiceManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(1);
      expect(servicesGrid.length).toEqual(0);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminServiceRoutes.MANAGE_ROUTE);
    });
    it("Should have a retry Services API call Button", () => {
      const retryButton = wrapper.find(ServiceManageHolder).find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
    });
    it("Should correctly re-dispatch the 'getServices' API request with the button click", async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/services", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          services: mockServices
        }
      });

      const retryButton = wrapper.find("#errorScreenRetryButton");
      retryButton.at(0).simulate("click");

      await act( async () => promise );
    });
    it("Should render ONLY the 'LoadingScreen' component after an API call retry", () => {
      const loadingScreen = wrapper.find(ServiceManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(ServiceManageHolder).find(ErrorScreen);
      const servicesGrid = wrapper.find(ServiceManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(servicesGrid.length).toEqual(0);
    });
    it("Should render correct number of 'ServiceCard' Components", () => {
      const serviceCards = wrapper.find(ServiceCard);
      expect(serviceCards.length).toEqual(mockServices.length);
    });
  });
  // END mock successfull API call tests //
});