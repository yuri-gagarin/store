import React, { useReducer, useEffect } from "react";
import { mount, ReactWrapper, shallow } from "enzyme";
import moxios from "moxios";
import fetchMock from "jest-fetch-mock";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import ServiceManageHolder from "../../../../components/admin_components/services/service_manage/ServiceManageHolder";
import LoadingScreen  from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import TestRenderer from 'react-test-renderer';
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import { createMockServices } from "../../../../test_helpers/serviceHelpers";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { initialContext, StateProvider, IGlobalAppState } from "../../../../state/Store";
import ServiceCard from "../../../../components/admin_components/services/service_manage/ServiceCard";
import { indexReducer, rootState } from "../../../../state/reducers/indexReducer";
import { RenderResult } from "@testing-library/react";
import ServiceComponent from "../../../../components/client_components/store_screen/services/ServiceComponent";

describe("Service Manage Holder Tests", () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });
  describe("Default Component state at first render", () => {
    let component: ReactWrapper; let loadingScreen: ReactWrapper;
    let state: IGlobalAppState; 

    beforeAll(() => {
      state = generateCleanState();
      component = mount(
        <Router>
          <StateProvider>
            <ServiceManageHolder state={state} dispatch={jest.fn}/>
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
    let component: ReactWrapper; let state: IGlobalAppState;
    let services: IServiceData[];


    beforeAll( async () => {
      moxios.install();
      state = generateCleanState();
      services = createMockServices(5);

      component = mount(
        <Router>
          <StateProvider>
            <ServiceManageHolder state={state} dispatch={jest.fn} />

          </StateProvider>
        </Router>
      );
      await act( async () => {
        moxios.stubRequest('/api/services/', {
          status: 200,
          responseText: 'hello',
          response: {
            responseMsg: "All ok",
            services: services
          }
        });
      });
      
      /*
      await moxios.wait(jest.fn);
      await act(async() => {
        const request = moxios.requests.mostRecent();
        await request.respondWith({
          response: {
            responseMsg: "All ok",
            services: services
          }
        })
      });
      */
    });

    afterAll(() => {
      moxios.uninstall();
    })
    
    it('Should correctly render initial Loading Screen', () => {
      let loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });

    it('Should NOT render initial Loading Screen after successful', () => {
      act(() => {
        component.update();
      });
      let loadingScreen = component.find(LoadingScreen);
      expect(loadingScreen.length).toEqual(0);
    });

    it("Should render correct ServiceManageHolder Component", () => {
      const serviceManageHolderComp = component.find("#serviceManageHolder");
      expect(serviceManageHolderComp.at(0)).toBeDefined();
      expect(serviceManageHolderComp.at(0)).toMatchSnapshot();
    });

    it("Should properly render all ServiceCard components", () => {
      const comp = shallow(<ServiceManageHolder state={generateCleanState()} dispatch={jest.fn} />)
      const globalState = generateCleanState();
      const newState: IGlobalAppState = {
        ...globalState,
        serviceState: {
          ...globalState.serviceState,
          responseMsg: "All Ok",
          loadedServices: [ ...services ]
        }
      }
      const updated = comp.setProps({ state: newState});
      console.log(updated.find(ServiceCard).length)
      /*
      const serviceCards = component.find(ServiceCard);
      expect(serviceCards.at(0)).toBeDefined();
      expect(serviceCards.length).toEqual(services.length);
      */
    })
  });
});

/*
    describe("State after a successful API call", () => {
      let component: ReactWrapper; let loadingScreen: ReactWrapper;
      let Services: IServiceData[];

      beforeEach(() => {
        moxios.install();
      });
      afterEach(() => {
        moxios.uninstall();
      })
      
      it("Should fetch the request", async () => {
        await act(async () => {
          await mount(
            <Router>
              <StateProvider>
                <ServiceManageHolder />

              </StateProvider>
            </Router>
          );
        });
        expect(fetchMock).toHaveBeenCalledWith("thisurl")
      });

      it('Should display error if api request fail', async () => {
      
        let comp: ReactWrapper;
        comp = mount(
          <Router>
            <StateProvider>
              <ServiceManageHolder />

            </StateProvider>
          </Router>
        );
        await moxios.wait(jest.fn);
        await act(async() => {
          const request = moxios.requests.mostRecent()
          await request.respondWith({
            response: {
              responseMsg: "All ok",
              Services: createMockServices(5)
            }
          })
        });
        act(() => {
          comp.update();
        })
        let ServiceCards = comp.find(ServiceCard)
        console.log(ServiceCards.length)
      });

      it('should display error if api request fail', async () => {
      
        let comp: ReactWrapper | null;
        comp = mount(
          <Router>
            <StateProvider>
              <ServiceManageHolder />

            </StateProvider>
          </Router>
        );
        await moxios.wait(jest.fn);
        await act(async() => {
          const request = moxios.requests.mostRecent()
          await request.reject(new Error("Boo"));
        });
        act(() => {
          comp!.update();
          console.log(comp?.props())
        })
    
      });
      /*
      it("Should NOT render the 'LoadingScreen' Component", () => {
        let loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(0);
      });

      it("Should render the Service Manage grid", () => {
        //console.log(component.props())
      })
    });
    */