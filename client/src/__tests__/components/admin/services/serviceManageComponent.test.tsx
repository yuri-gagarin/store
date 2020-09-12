import React from "react";
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import ServiceManageHolder from "../../../../components/admin_components/services/service_manage/ServiceManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import ErrorComponent from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import { act } from "react-dom/test-utils";
import { createMockServices } from "../../../../test_helpers/serviceHelpers";
import { StateProvider } from "../../../../state/Store";
import ServiceCard from "../../../../components/admin_components/services/service_manage/ServiceCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import { error } from "console";

describe("Service Manage Holder Tests", () => {
  
    describe("Default Component state at first render", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      beforeAll( async () => {
        moxios.install();
        component = mount(
          <Router>
            <StateProvider>
              <ServiceManageHolder />
            </StateProvider>
          </Router>
        );

        await act( async () => {
          await moxios.stubRequest("/api/services/", {
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
        expect(component).toMatchSnapshot();
      });
      
      it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1)
      });
    });
    
    // mock successful API call render tests //
    describe("State after a successful API call", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      let services: IServiceData[];

      beforeAll( async () => {
        moxios.install();
        services = createMockServices(5);

        component = mount(
          <Router>
            <StateProvider>
              <ServiceManageHolder />
            </StateProvider>
          </Router>
        );
        
        await act( async () => {
          await moxios.stubRequest("/api/services/", {
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
        act( () => {
          component.update();
        });
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(0);
      });
      it("Should NOT render the ErrorScreen Component", () => {
        const errorScreenComponent = component.find(ErrorScreen);
        expect(errorScreenComponent.length).toEqual(0);
      });
  
      it("Should render the correct ServiceManageHolder Component", () => {
        const serviceManageHolderComp = component.find("#serviceManageHolder");
        expect(serviceManageHolderComp.at(0)).toBeDefined();
        expect(serviceManageHolderComp.at(0)).toMatchSnapshot();
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
      let services: IServiceData[];

      beforeAll(async () => {
        await act(async () => {
          moxios.install();
          component = await mount(
            <Router>
              <StateProvider>
                <ServiceManageHolder />
              </StateProvider>
            </Router>
          );
          moxios.stubRequest("/api/services/", {
            status: 500,
            response: {
              responseMsg: "Error here",
              error: new Error("API Call Error")
            }
          });
        });
        act(() => {
          moxios.uninstall();
        })
      });

      it("Should correctly render the initial Loading Screen", () => {
        loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1);
      });

      it("Should not render the initial Loading Screen after an  API call", () => {
        act( () => {
          component.update();
        });
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
        const retryButton = component.find("#errorScreenRetryButton");
        expect(retryButton.length).toEqual(2);
      });
      
      
      it("Should correctly re-dispatch the 'getServices' API request with the button click", async () => {
        await act( async () => {
          services = createMockServices(6);
          moxios.install();
          moxios.stubRequest("/api/services/", {
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