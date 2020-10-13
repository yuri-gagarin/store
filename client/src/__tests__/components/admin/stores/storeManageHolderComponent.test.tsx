import React from "react";
import { Grid } from "semantic-ui-react";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter as Router } from "react-router-dom";
// components //
import StoreManageHolder from "../../../../components/admin_components/stores/store_manage/StoreManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import StoreCard from "../../../../components/admin_components/stores/store_manage/StoreCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
// helpers and state //
import { TestStateProvider } from "../../../../state/Store";
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";

describe("Store Manage Holder Tests", () => {
    let mockStores: IStoreData[];

    beforeAll(() => {
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
        }
      ]
    })
    describe("Default Component state at first render", () => {
      let wrapper: ReactWrapper; 

      beforeAll( async () => {
        moxios.install();
        wrapper = mount(
          <Router keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </Router>
        );

        await act( async () => {
          await moxios.stubRequest("/api/stores", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              stores: []
            }
          });
        });

      });
       afterAll(() => {
        moxios.uninstall();
      }); 
      
      it("Should correctly render", () => {
        expect(wrapper.find(StoreManageHolder)).toMatchSnapshot();
      });
      
      it("Should render a 'LoadingScreen' Component before an API call resolves", () => {
        const loadingScreen = wrapper.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1)
      });
    });
    
    // mock successful API call render tests //
    describe("State after a successful API call", () => {
      let wrapper: ReactWrapper; let loadingScreen: ReactWrapper;

      beforeAll( async () => {
        moxios.install();

        wrapper = mount(
          <Router keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </Router>
        );
        
        await act( async () => {
          await moxios.stubRequest("/api/stores", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              stores: mockStores
            }
          });
        });
      });

      afterAll(() => {
        moxios.uninstall();
      }); 

      it("Should correctly render the initial Loading Screen", () => {
        const loadingScreen = wrapper.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1);
      });
      it("Should not render the initial Loading Screen after the API call", async () => {
        act( () => {
          wrapper.update();
        });
        const loadingScreen = wrapper.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(0);
      });
      it("Should NOT render the ErrorScreen Component", () => {
        const errorScreenComponent = wrapper.find(ErrorScreen);
        expect(errorScreenComponent.length).toEqual(0);
      });
  
      it("Should render the correct StoreManageHolder Component", () => {
        const storeManageHolderComp = wrapper.find(StoreManageHolder).find(Grid);
        expect(storeManageHolderComp.length).toEqual(1)
        expect(storeManageHolderComp).toMatchSnapshot();
      });
    
      it("Should render correct number of StoreCard components", () => {
        const storeCards = wrapper.find(StoreCard);
        expect(storeCards.length).toEqual(mockStores.length);
      })
    });
    // END mock successfull API call render tests //
    // mock ERROR API call render tests //
    describe("State after a Error in API call", () => {
      let wrapper: ReactWrapper;

      beforeAll(async () => {
        await act(async () => {
          moxios.install();
          wrapper = await mount(
            <Router keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
              <TestStateProvider>
                <StoreManageHolder />
              </TestStateProvider>
            </Router>
          );
          moxios.stubRequest("/api/stores", {
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
        const loadingScreen = wrapper.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(1);
      });

      it("Should not render the initial Loading Screen after an  API call", () => {
        act( () => {
          wrapper.update();
        });
        const loadingScreen = wrapper.find(LoadingScreen);
        expect(loadingScreen.length).toEqual(0);
      });
      it("Should render the ErrorScreen Component", () => {
        const errorScreenComponent = wrapper.find(ErrorScreen);
        expect(errorScreenComponent.length).toEqual(1);
      });
      
      it("Should NOT render the StoreManageHolder Component", () => {
        const storeManageHolderComp = wrapper.find(StoreManageHolder).find(Grid);
        expect(storeManageHolderComp.length).toEqual(0);
      });
    
      it("Should NOT render ANY StoreCard components", () => {
        const storeCards = wrapper.find(StoreCard);
        expect(storeCards.length).toEqual(0);
      });
  
      it("Should have a retry Store API call Button", () => {
        const retryButton = wrapper.find(ErrorScreen).render().find("#errorScreenRetryButton");
        expect(retryButton.length).toEqual(1);
      });
      
      
      it("Should correctly re-dispatch the 'getStores' API request with the button click", async () => {
        await act( async () => {
          moxios.install();
          moxios.stubRequest("/api/stores", {
            status: 200,
            response: {
              responseMsg: "All Ok",
              stores: mockStores
            }
          });
          const retryButton = wrapper.find("#errorScreenRetryButton");
          retryButton.at(0).simulate("click");
        });
      });
      it("Should properly rerender 'StoreManageHolder' component", () => {
        wrapper.update()
        const errorScreen = wrapper.find(ErrorScreen);
        const storeManageHolderComp = wrapper.find(StoreManageHolder).find(Grid);
        // assert correct rendering //
        expect(errorScreen.length).toEqual(0);
        expect(storeManageHolderComp.length).toEqual(1);
      });
      
      it("Should render correct number of 'StoreCard' Components", () => {
        const storeCards = wrapper.find(StoreCard);
        expect(storeCards.length).toEqual(mockStores.length);
      });
    });
    // END mock successfull API call tests //
    
  
});