import React from "react";
import { Button, Confirm, Grid } from "semantic-ui-react";
import moxios from "moxios";
// test dependencies
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
// routing //
import { MemoryRouter, Router } from "react-router-dom";
import { AdminStoreItemRoutes } from "../../../../routes/adminRoutes";
// components //
import StoreItemsManageHolder from "../../../../components/admin_components/store_items/store_items_manage/StoreItemsManageHolder";
import StoreItemCard from "../../../../components/admin_components/store_items/store_items_manage/StoreItemCard";
import ErrorScreen from "../../../../components/admin_components/miscelaneous/ErrorScreen";
import LoadingScreen from "../../../../components/admin_components/miscelaneous/LoadingScreen";
import { StoreItemFormHolder } from "../../../../components/admin_components/store_items/forms/StoreItemFormHolder";
import StoreItemForm from "../../../../components/admin_components/store_items/forms/StoreItemForm";

// helpers and state //
import { TestStateProvider } from "../../../../state/Store";

describe("StoreItem Manage Holder Tests", () => {
  const mockDate: string = new Date("12/31/2019").toString();
  let mockStoreItems: IStoreItemData[];
  let mockStore: IStoreData;

  beforeAll(() => {
    mockStore = {
      _id:"1111",
      title: "title",
      description: "description",
      images: [],
      createdAt: mockDate
    };

    mockStoreItems = [
      {
        _id: "1",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "first",
        price: "100",
        details: "details",
        description: "description",
        categories: [],
        images: [],
        createdAt: mockDate
      },
      {
        _id: "2",
        storeId: mockStore._id,
        storeName: mockStore.title,
        name: "second",
        price: "200",
        details: "details",
        description: "description",
        categories: [],
        images: [],
        createdAt: mockDate
      },
      {
        _id: "3",
        storeId: mockStore._id,
        storeName: mockStore._id,
        name: "third",
        price: "300",
        details: "details",
        description: "description",
        categories: [],
        images: [],
        createdAt: mockDate
      }
    ];
  });
  
  describe("Default Component state at first render", () => {
    let wrapper: ReactWrapper;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: []
        }
      });

      wrapper = mount(
        <MemoryRouter initialEntries={[AdminStoreItemRoutes.MANAGE_ROUTE]} keyLength={0}>
          <TestStateProvider>
            <StoreItemsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });

    afterAll(() => {
      moxios.uninstall();
    }); 
    
    it("Should render the 'LoadingScreen' component before an API call completes", () => {
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      expect(loadingScreen.length).toEqual(1);
    });
    it("Should NOT render the 'ErrorScreen' component", () => {
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      expect(errorScreen.length).toEqual(0);
    });
    it("Should NOT render the 'Store Items' Grid", () => {
      expect(wrapper.find(Grid).length).toEqual(0);
    });
  });
    
  // mock successful API call render tests //
  describe("State after a successful API call", () => {
    let wrapper: ReactWrapper; 

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      })
      wrapper = mount(
        <MemoryRouter initialEntries={[AdminStoreItemRoutes.MANAGE_ROUTE]} keyLength={0}>
          <TestStateProvider>
            <StoreItemsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      
      await act( async () => promise);
    });

    afterAll(() => {
      moxios.uninstall();
    }); 

    it("Should correctly render the initial 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(0);
    });
    it("Should correctly render the 'StoreItemsManageHolder' 'Grid' after a 'successful' API call", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(wrapper.find(StoreItemsManageHolder)).toMatchSnapshot();
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(1);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.MANAGE_ROUTE);
    })
    it("Should render correct number of StoreItemCard components", () => {
      const storeItemCards = wrapper.find(StoreItemCard);
      expect(storeItemCards.length).toEqual(mockStoreItems.length);
    });
  });
  // END mock successfull API call render tests //
  // mock ERROR API call render tests //
  describe("State after a Error in API call", () => {
    let wrapper: ReactWrapper;
    const error = new Error("An error occured");

    beforeAll(async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 500,
        response: {
          responseMsg: "Error",
          error: error
        }
      });

      wrapper = mount(
        <MemoryRouter keyLength={0} initialEntries={[ AdminStoreItemRoutes.MANAGE_ROUTE ]}>
          <TestStateProvider>
            <StoreItemsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should correctly render the 'LoadingScreen' component", () => {
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(0);
    });
    it("Should ONLY render the 'ErrorScreen' component after API error", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeITemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);      
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(1);
      expect(storeITemsGrid.length).toEqual(0);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.MANAGE_ROUTE);
    });
    it("Should have a retry StoreItem API call Button", () => {
      const retryButton = wrapper.find(StoreItemsManageHolder).find(ErrorScreen).render().find("#errorScreenRetryButton");
      expect(retryButton.length).toEqual(1);
    });
    it("Should correctly re-dispatch the 'getStoreItems' API request with the button click", async () => {
      const promise = Promise.resolve();

      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All Ok",
          storeItems: mockStoreItems
        }
      });

      const retryButton = wrapper.find("#errorScreenRetryButton");
      retryButton.at(0).simulate("click");

      await act( async () => promise);
    });
    it("Should render ONLY 'LoadingScreen' component after API call retry", () => {
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(1);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(0);
    })
    it("Should correctly rerender 'StoreItemsManageHolder' component", () => {
      wrapper.update();
      const loadingScreen = wrapper.find(StoreItemsManageHolder).find(LoadingScreen);
      const errorScreen = wrapper.find(StoreItemsManageHolder).find(ErrorScreen);
      const storeItemsGrid = wrapper.find(StoreItemsManageHolder).find(Grid);
      // assert correct rendering //
      expect(loadingScreen.length).toEqual(0);
      expect(errorScreen.length).toEqual(0);
      expect(storeItemsGrid.length).toEqual(1);
    });
    it("Should render a correct number of 'ProductCard' components", () => {
      const storeItemsCatds = wrapper.find(StoreItemsManageHolder).find(StoreItemCard);
      expect(storeItemsCatds.length).toEqual(mockStoreItems.length);
    });
    it("Should NOT change the client route", () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminStoreItemRoutes.MANAGE_ROUTE);
    });
  });
  
  // TEST StoreItemCard EDIT button click //
  describe("'StoreItemCard' component EDIT button click action", () => {
    let wrapper: ReactWrapper;
    let editWrapper: ReactWrapper;
    window.scrollTo = jest.fn();

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      });
      wrapper = mount(
        <MemoryRouter initialEntries={[AdminStoreItemRoutes.MANAGE_ROUTE]} keyLength={0}>p
          <TestStateProvider>
            <StoreItemsManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
      wrapper.update();
    });
    it("Should render the 'StoreItemFormHolder' component after 'edit' Button click action", () => {
      const editButton = wrapper.find(StoreItemCard).at(0).find(".storeItemCardEditBtn").at(0);
      editButton.simulate("click");
      const storeItmFormHold = wrapper.find(StoreItemFormHolder);
      expect(storeItmFormHold.length).toEqual(1);
    });
    it("Should display the in '#storeItemFormHolderDetailsHolder' component", () => {
      const detailsHolder = wrapper.find(StoreItemFormHolder).render().find("#storeItemFormHolderDetailsHolder");
      expect(detailsHolder.length).toEqual(1);
    });
    it("Should display correct data in '.storeItemFormHolderDetail' '<div>'s", () => {
      const detailsDivs = wrapper.find(StoreItemFormHolder).find(".storeItemFormHolderDetail");
      expect(detailsDivs.length).toEqual(4);
      // assert correct data rendering //
      expect(detailsDivs.at(0).render().find("p").html()).toEqual(mockStoreItems[0].name);
      expect(detailsDivs.at(1).render().find("p").html()).toEqual(mockStoreItems[0].price);
      expect(detailsDivs.at(2).render().find("p").html()).toEqual(mockStoreItems[0].description);
      expect(detailsDivs.at(3).render().find("p").html()).toEqual(mockStoreItems[0].details);
    });
    it("Should correctly render the 'StoreItemForm' component", () => {
      const storeItemFormToggleBtn = wrapper.find(StoreItemFormHolder).find("#storeItemFormToggleBtn");
      // toggle form //
      storeItemFormToggleBtn.at(0).simulate("click");
      // assert correct rendering //
      const storeItemForm = wrapper.find(StoreItemForm);
      expect(storeItemForm.length).toEqual(1);
    });
    it("Should correctly render the 'currentStoreItem' data within 'StoreItemForm' component", () => {
      const currentStoreItem = mockStoreItems[0];
      const nameInput = wrapper.find(StoreItemForm).find("#storeItemFormNameInput");
      const priceInput = wrapper.find(StoreItemForm).find("#storeItemFormPriceInput");
      const detailsInput = wrapper.find(StoreItemForm).find("#storeItemFormDetailsInput");
      const descriptionInput = wrapper.find(StoreItemForm).find("#storeItemFormDescInput");
      // assert correct rendering //
      expect(nameInput.props().value).toEqual(currentStoreItem.name);
      expect(priceInput.props().value).toEqual(currentStoreItem.price);
      expect(detailsInput.at(0).props().value).toEqual(currentStoreItem.details);
      expect(descriptionInput.at(0).props().value).toEqual(currentStoreItem.description);

    })
    it(`Should route to a correct client route: ${AdminStoreItemRoutes.EDIT_ROUTE}`, () => {
      const router = wrapper.find(Router);
      expect(router.props().history.location.pathname).toEqual(AdminStoreItemRoutes.EDIT_ROUTE);
    });
    it("Should correctly handle the '#adminStoreItemsManageBackBtn' click, close 'StoreItemFormHolder' component", () => {
      const backBtn = wrapper.find(StoreItemsManageHolder).find("#adminStoreItemsManageBackBtn");
      backBtn.at(0).simulate("click");
      expect(wrapper.find(StoreItemFormHolder).length).toEqual(0);
    });
    it(`Should route to a correct client route: ${AdminStoreItemRoutes.MANAGE_ROUTE}`, () => {
      const router = wrapper.find(Router);
      expect(router.props().history.location.pathname).toEqual(AdminStoreItemRoutes.MANAGE_ROUTE);
    });
  });
  // END TEST StoreItemCard EDIT button click //
  // TEST SToreItemCard DELETE button click //
  describe("'StoreItemCard' component DELETE button click action", () => {
    let wrapper: ReactWrapper;
    let mockDeletedStoreItem: IStoreItemData;
    window.scrollTo = jest.fn();

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/store_items", {
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      });
      mockDeletedStoreItem = mockStoreItems[0];
      // mount and update //
      wrapper = mount(
        <MemoryRouter initialEntries={[AdminStoreItemRoutes.MANAGE_ROUTE]} keyLength={0}>
          <TestStateProvider>
            <StoreItemsManageHolder />
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
    })

    it("Should render 'StoreItemDeleteConfirm' component after 'delete' Button click action", () => {
      const deleteBtn = wrapper.find(StoreItemCard).at(0).find(".storeItemCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(StoreItemCard).at(0).find(Confirm);
      // assert correct rendering //
      expect(confirmModal.props().open).toEqual(true);
      expect(confirmModal.find(Button).length).toEqual(2);
    });
    it("Should correctly handle {cancelStoreItemDeleteAction} method and correctly update local state", () => {
      const deleteBtn = wrapper.find(StoreItemCard).at(0).find(".storeItemCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(StoreItemCard).at(0).find(Confirm);
      // simulate cancel button click //
      confirmModal.find(Button).at(0).simulate("click");
      // assert correct rendering //
      expect(wrapper.find(StoreItemCard).at(0).find(Confirm).props().open).toEqual(false);
      expect(wrapper.find(StoreItemCard).length).toEqual(mockStoreItems.length);
    });
    it("Should correctly handle {confirmStoreItemDeleteAction} method and correctly update local state", async () => {
      const promise = Promise.resolve();
      moxios.stubRequest(`/api/store_items/delete/${mockStoreItems[0]._id}`, {
        status: 200,
        response: {
          responseMsg: "All ok",
          deletedStoreItem: mockDeletedStoreItem
        }        
      });
      moxios.install()
      const deleteBtn = wrapper.find(StoreItemCard).at(0).find(".storeItemCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(StoreItemCard).at(0).find(Confirm);
      // simulate confirm button click //
      confirmModal.find(Button).at(1).simulate("click");
      // assert correct rendering //
      await act (async () => promise);
      expect(moxios.requests.mostRecent().url).toEqual(`/api/store_items/delete/${mockStoreItems[0]._id}`);
    });
    it("Should correctly updated and rerender 'StoreItemManage' component", () => {
      wrapper.update();
      expect(wrapper.find(StoreItemsManageHolder).find(LoadingScreen).length).toEqual(0);
      expect(wrapper.find(StoreItemsManageHolder).find(ErrorScreen).length).toEqual(0);
      expect(wrapper.find(StoreItemsManageHolder).find(Grid).length).toEqual(1);
    });
    it("Should NOT render the 'removed' 'StoreItemCard' component", () => {
      const storeItemCards = wrapper.find(StoreItemsManageHolder).find(StoreItemCard);
      storeItemCards.forEach((storeItemCard) => {
        expect(storeItemCard.props().storeItem._id).not.toEqual(mockDeletedStoreItem._id);
      });
    });
    it("Should rerender with correct number of 'StoreItemCard' components", () => {
      const storeItemCards = wrapper.find(StoreItemsManageHolder).find(StoreItemCard);
      expect(storeItemCards.length).toEqual(mockStoreItems.length - 1);
    });

  })
  // END mock successfull API call tests //
});