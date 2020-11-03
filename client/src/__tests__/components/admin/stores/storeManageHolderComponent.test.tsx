import React from "react";
import { Button, Confirm, Grid } from "semantic-ui-react";
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
import { Store, TestStateProvider } from "../../../../state/Store";
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";

describe("Store Manage Holder Tests", () => {
    const createdDate: string = new Date("12/31/2019").toString();
    let mockStores: IStoreData[];

    beforeAll(() => {
      mockStores = [
        {
          _id: "1",
          title: "first",
          description: "description",
          images: [],
          createdAt: createdDate
        },
        {
          _id: "2",
          title: "second",
          description: "description",
          images: [],
          createdAt: createdDate
        },
        {
          _id: "3",
          title: "third",
          description: "description",
          images: [],
          createdAt: createdDate
        }
      ];
    });
    // TEST component state at first render //
    describe("Default Component state at first render", () => {
      let wrapper: ReactWrapper; 

      beforeAll( async () => {
        const promise = Promise.resolve();

        moxios.uninstall();
        moxios.stubRequest("/api/stores", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            stores: []
          }
        });

        wrapper = mount(
          <MemoryRouter keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </MemoryRouter>
        );
        await act( async () => promise);
      });
       afterAll(() => {
        moxios.uninstall();
      }); 
      
      it("Should render a LoadingScreen' Component before an API call", () => {
        const loadingScreen = wrapper.find(StoreManageHolder).find(LoadingScreen);
        const errorScreen = wrapper.find(StoreManageHolder).find(ErrorScreen);
        const storesGrid = wrapper.find(StoreManageHolder).find(Grid);
        // assert correct rendering //
        expect(loadingScreen.length).toEqual(1)
        expect(errorScreen.length).toEqual(0);
        expect(storesGrid.length).toEqual(0);
      })
      it("Should correctly render", () => {
        expect(wrapper.find(StoreManageHolder)).toMatchSnapshot();
      });
    });
    // END TEST component at first render //
    // TEST mock successful API call render tests //
    describe("'StoreManageHolder' component after a successful API call", () => {
      let wrapper: ReactWrapper; 

      beforeAll( async () => {
        const promise = Promise.resolve();
        moxios.install();
        moxios.stubRequest("/api/stores", {
          status: 200,
          response: {
            responseMsg: "All Ok",
            stores: mockStores
          }
        });

        wrapper = mount(
          <MemoryRouter keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </MemoryRouter>
        );
        
       await act( async () => promise);
      });

      afterAll(() => {
        moxios.uninstall();
      }); 

      it("Should correctly render the initial 'LoadingScreen' component", () => {
        const loadingScreen = wrapper.find(StoreManageHolder).find(LoadingScreen);
        const errorScreen = wrapper.find(StoreManageHolder).find(ErrorScreen);
        const storesGrid = wrapper.find(StoreManageHolder).find(Grid);
        // assert correct rendering //
        expect(loadingScreen.length).toEqual(1);
        expect(errorScreen.length).toEqual(0);
        expect(storesGrid.length).toEqual(0);
      });
      it("Should render the correct 'StoreManageHolder' 'Grid' Component", () => {
        wrapper.update();
        const loadingScreen = wrapper.find(StoreManageHolder).find(LoadingScreen);
        const errorScreen = wrapper.find(StoreManageHolder).find(ErrorScreen);
        const storesGrid = wrapper.find(StoreManageHolder).find(Grid);
        // assert correct rendering //
        expect(wrapper.find(StoreManageHolder)).toMatchSnapshot();
        expect(loadingScreen.length).toEqual(0);
        expect(errorScreen.length).toEqual(0);
        expect(storesGrid.length).toEqual(1);
      });
      it("Should NOT change the client route", () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.MANAGE_ROUTE);
      });
      it("Should render correct number of StoreCard components", () => {
        const storeCards = wrapper.find(StoreManageHolder).find(StoreCard);
        expect(storeCards.length).toEqual(mockStores.length);
      });

    });
    // END mock successfull API call render tests //
    // TEST mock ERROR API call render tests //
    describe("'StoreManageHolde' component state after a Error in API call", () => {
      let wrapper: ReactWrapper;
      const error = new Error("Error occured");

      beforeAll( async () => {
        const promise = Promise.resolve();
        moxios.install();
        moxios.stubRequest("/api/stores", {
          status: 500,
          response: {
            responseMsg: "Error here",
            error: new Error("API Call Error")
          }
        });

        wrapper = mount(
          <MemoryRouter keyLength={0} initialEntries={[AdminStoreRoutes.MANAGE_ROUTE]}>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </MemoryRouter>
        );
        await act( async () => promise);
      });
      afterEach(() => {
        moxios.uninstall();
      });

      it("Should correctly render the 'LoadingScreen' component", () => {
        const loadingScreen = wrapper.find(StoreManageHolder).find(LoadingScreen);
        const errorScreen = wrapper.find(StoreManageHolder).find(ErrorScreen);
        const storesGrid = wrapper.find(StoreManageHolder).find(Grid);
        // assert correct rendering //
        expect(loadingScreen.length).toEqual(1);
        expect(errorScreen.length).toEqual(0);
        expect(storesGrid.length).toEqual(0);
      });

      it("Should ONLT render the 'ErrorScreen' Component after API error", () => {
        wrapper.update();
        const loadingScreen = wrapper.find(StoreManageHolder).find(LoadingScreen);
        const errorScreenComponent = wrapper.find(ErrorScreen).find(ErrorScreen);
        const storesGrid = wrapper.find(StoreManageHolder).find(Grid);
        // assert correct rendering //
        expect(loadingScreen.length).toEqual(0);
        expect(errorScreenComponent.length).toEqual(1);
        expect(storesGrid.length).toEqual(0);
      });
      it("Should NOT change the client route", () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.MANAGE_ROUTE);
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
        const promise = Promise.resolve();

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

        await act( async () =>promise);
        expect(wrapper.find(StoreManageHolder).find(ErrorScreen).length).toEqual(0);
      });
      it("Should render ONLY 'LoadingScreen' component after an API call", () => {
        const loadingScreen = wrapper.find(StoreManageHolder).find(LoadingScreen);
        const errorScreen = wrapper.find(StoreManageHolder).find(ErrorScreen);
        const storesGrid = wrapper.find(StoreManageHolder).find(Grid);
        // assert correct rendering //
        expect(loadingScreen.length).toEqual(1);
        expect(errorScreen.length).toEqual(0);
        expect(storesGrid.length).toEqual(0);
      });
      it("Should properly rerender 'StoreManageHolder' component", () => {
        wrapper.update()
        const loadingScreen = wrapper.find(StoreManageHolder).find(LoadingScreen);
        const errorScreen = wrapper.find(StoreManageHolder).find(ErrorScreen);
        const storesGrid = wrapper.find(StoreManageHolder).find(Grid);
        // assert correct rendering //
        expect(loadingScreen.length).toEqual(0)
        expect(errorScreen.length).toEqual(0);
        expect(storesGrid.length).toEqual(1);
      });
      it("Should render correct number of 'StoreCard' Components", () => {
        const storeCards = wrapper.find(StoreManageHolder).find(StoreCard);
        expect(storeCards.length).toEqual(mockStores.length);
      });
      it("Should NOT change the client route", () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminStoreRoutes.MANAGE_ROUTE);
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
          <MemoryRouter initialEntries={[ AdminStoreRoutes.MANAGE_ROUTE ]} keyLength={0}>
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
        editButton.at(0).simulate("click");
        const storeFormholder = wrapper.find(StoreFormHolder);
        // console.log(wra)
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
        const descriptionInput = wrapper.find(StoreForm).find("#adminStoreFormDescInput");
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
    // TEST StoreCard DELETE buton click //
    describe("'StoreCard' component DELETE button click action", () => {
      let wrapper: ReactWrapper;
      let mockDeletedStore: IStoreData;
      window.scrollTo = jest.fn;

      beforeAll( async () => {
        const promise = Promise.resolve();
        moxios.install();
        moxios.stubRequest("/api/stores", {
          status: 200,
          response: {
            responseMsg: "All ok",
            stores: mockStores
          }
        })
        mockDeletedStore = mockStores[0];
        // mount and update //
        wrapper = mount(
          <MemoryRouter initialEntries={[ AdminStoreRoutes.MANAGE_ROUTE ]} keyLength={0}>
            <TestStateProvider>
              <StoreManageHolder />
            </TestStateProvider>
          </MemoryRouter>
        );
        await act( async () => promise);
        wrapper.update();
      });
      beforeEach(() => {
        moxios.install();
      });
      afterEach(() => {
        moxios.uninstall();
      });

      it("Should render the 'Confirm' component after the 'DELETE' Button click action", () => {
        const deleteBtn = wrapper.find(StoreCard).at(0).find(".storeCardDeleteBtn");
        deleteBtn.at(0).simulate("click");
        const confirmModal = wrapper.find(StoreCard).at(0).find(Confirm);
        // assert correct rendering //
        expect(confirmModal.props().open).toEqual(true);
        expect(confirmModal.find(Button).length).toEqual(2);
      });
      it("Should correctly handle the {cancelStoreDeleteAction} method and update the local component state", () => {
        const deleteBtn = wrapper.find(StoreCard).at(0).find(".storeCardDeleteBtn");
        deleteBtn.at(0).simulate("click");
        const confirmModal = wrapper.find(StoreCard).at(0).find(Confirm);
        // simulate cancel button click //
        confirmModal.find(Button).at(0).simulate("click");
        // assert correct rendering //
        expect(wrapper.find(StoreCard).at(0).find(Confirm).props().open).toEqual(false);
        expect(wrapper.find(StoreCard).length).toEqual(mockStores.length);
      });
      it("Should correctly handle {confirmStoreDeleteAction} method and correctly update local component state", async () => {
        const promise = Promise.resolve();
        moxios.stubRequest(`/api/stores/delete/${mockStores[0]._id}`, {
          status: 200,
          response: {
            responseMsg: "All ok",
            deletedStore: mockDeletedStore
          }
        });
        // simulate click action //
        const deleteBtn = wrapper.find(StoreCard).at(0).find(".storeCardDeleteBtn");
        deleteBtn.at(0).simulate("click");
        const confirmModal = wrapper.find(StoreCard).at(0).find(Confirm);
        // simulate confirm action click //
        confirmModal.find(Button).at(1).simulate("click");
        await act( async () => promise);
        expect(moxios.requests.mostRecent().url).toEqual(`/api/stores/delete/${mockStores[0]._id}`);
      });
      it("Should correctly updated and rerender 'StoreManageHolder' component", () => {
        wrapper.update();
        expect(wrapper.find(StoreManageHolder).find(LoadingScreen).length).toEqual(0);
        expect(wrapper.find(StoreManageHolder).find(ErrorScreen).length).toEqual(0);
        expect(wrapper.find(StoreManageHolder).find(Grid).length).toEqual(1);
      });
      it("Should NOT render the 'removed' 'StoreCard' component", () => {
        const storeCards = wrapper.find(StoreManageHolder).find(StoreCard);
        storeCards.forEach((storeCard) => {
          expect(storeCard.props()._id).not.toEqual(mockDeletedStore._id);
        });
      });
      it("Should rerender with correct number of 'StoreCard' components", () => {
        const storeCards = wrapper.find(StoreManageHolder).find(StoreCard);
        expect(storeCards.length).toEqual(mockStores.length - 1);
      });
    })
  
});