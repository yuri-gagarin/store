import React from "react";
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import StoreManageHolder from "../../../../components/admin_components/stores/store_manage/StoreManageHolder";
import LoadingScreen  from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import { act } from "react-dom/test-utils";

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
            <StoreManageHolder />
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

      beforeEach(() => {
        moxios.install();
      });
      afterEach(() => {
        moxios.uninstall();
      });
    
      it("Should properly render",  async () => {
        component = mount(
          <Router>
            <StoreManageHolder />
          </Router>
        );
        
        await act( async () => {
          moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
              status: 200,
              response: {
                responseMsg: "All ok",
                stores: []
              }
            });
          })
          component.update();
          console.log(component.html());
        
        })
        
        expect(component).toMatchSnapshot();
      });
      
      it("Should NOT render the 'LoadingScreen' Component", () => {
        let loadingScreen = component.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(0);
      });

    });
    
  });
  
});