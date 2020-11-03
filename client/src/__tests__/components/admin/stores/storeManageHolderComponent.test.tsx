import React from "react";
import { Grid } from "semantic-ui-react";
// test dependencies //
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Router } from "react-router-dom";
// components //
import StoreManageHolder from "../../../../components/admin_components/stores/store_manage/StoreManageHolder";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import StoreCard from "../../../../components/admin_components/stores/store_manage/StoreCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import StoreFormHolder from "../../../../components/admin_components/stores/forms/StoreFormHolder";
import StoreForm from "../../../../components/admin_components/stores/forms/StoreForm";
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
          <MemoryRouter keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </MemoryRouter>
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
          <MemoryRouter keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </MemoryRouter>
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
            <MemoryRouter keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
              <TestStateProvider>
                <StoreManageHolder />
              </TestStateProvider>
            </MemoryRouter>
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
    // TEST StoreCard component EDIT button tests //
    describe("'StoreCard component EDIT button click action", () => {
      let wrapper: ReactWrapper;
      window.scrollTo = jest.fn;

      beforeAll( async () => {
        const promise = Promise.resolve();
        moxios.install();
        moxios.stubRequest("/api/stores",  {
          status: 200,
          response: {
            responseMsg: "All ok",
            stores: mockStores
          }
        });

        wrapper = mount(
          <MemoryRouter>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </MemoryRouter>
        );
        await act( async () => promise);
        wrapper.update();
      });

      it("Should render the 'StoreFormHolder' component after EDIT Button click", () => {
        const editButton = wrapper.find(StoreCard).at(0).find(".storeCardEditBtn");
        editButton.simulate("click");
        const storeFormholder = wrapper.find(StoreFormHolder);
        expect(storeFormholder.length).toEqual(1);
      });
      it("Should render the '#storeFormHolderDetails' component", () => {
        const detailsHolder = wrapper.find(StoreFormHolder).render().find("#adminStoreFormHolderDetails");
        expect(detailsHolder.length).toEqual(1);
      });
      it("Should display the correct data in '.storeFormHolderDetailsItem' components", () => {
        const detailsDivs = wrapper.find(StoreFormHolder).find(".adminStoreFormHolderDetailsItem");
        expect(detailsDivs.length).toEqual(2);
        expect(detailsDivs.at(0).find("p").text()).toEqual(mockStores[0].title);
        expect(detailsDivs.at(1).find("p").text()).toEqual(mockStores[1].description);
      });
      it("Should correctly render the 'StoreForm' component", () => {
        const storeFormToggleBtn = wrapper.find(StoreFormHolder).find("#adminStoreFormToggleBtn");
        // toggle StoreForm //
        storeFormToggleBtn.at(0).simulate("click");
        // assert correct rendering //
        const storeForm = wrapper.find(StoreForm);
        expect(storeForm.length).toEqual(1);
      });
      it("Shuld correctly render the 'currentStore' data within the 'StoreForm' component", () => {
        const currentStore = mockStores[0];
        const titleInput = wrapper.find(StoreForm).find("#adminStoreFormTitleInput");
        const descriptionInput = wrapper.find(StoreForm).find("adminStoreFormDescInput");
        // assert correct rendering //
        expect(titleInput.props().value).toEqual(currentStore.title);
        expect(descriptionInput.at(0).props().value).toEqual(currentStore.description);
      });
      it(`Should route to a correct client route: ${AdminStoreRoutes.EDIT_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.EDIT_ROUTE);
      });
      it("Should correctly handle the '#adminStoreManageBackBtn' click and close 'StoreFormHolder' component", () => {
        const backBtn = wrapper.find(StoreManageHolder).find("#adminStoreManageBackBtn");
        backBtn.at(0).simulate("click");
        expect(wrapper.find(StoreFormHolder).length).toEqual(0);
      });
      it(`Should route to a correct client route: ${AdminStoreRoutes.MANAGE_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.MANAGE_ROUTE);
      });
    });
    // END TEST StoreCard EDIT button click //
    
  
});