import React from "react";
import { Button, Confirm, Grid } from "semantic-ui-react";
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
import { ServiceFormContainer } from "../../../../components/admin_components/services/forms/ServiceFormContainer";
import ServiceForm from "../../../../components/admin_components/services/forms/ServiceForm";
// helpers and state //
import { TestStateProvider } from "../../../../state/Store";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";

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
      wrapper.update();
      const serviceCards = wrapper.find(ServiceCard);
      expect(serviceCards.length).toEqual(mockServices.length);
    });
  });
  // END mock successfull API call tests //
  // TEST ServiceCard EDIT button functionality //
  describe("'ServiceCard' component EDIT button click action", () => {
    let wrapper: ReactWrapper;
    window.scrollTo = jest.fn;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/services", {
        status: 200,
        response: {
          responseMsg: "All ok",
          services: mockServices
        }
      });

      wrapper = mount(
        <MemoryRouter initialEntries={[ AdminServiceRoutes.MANAGE_ROUTE ]} keyLength={0}>
          <TestStateProvider>
            <ServiceManageHolder />
          </TestStateProvider>
        </MemoryRouter>
      );
      await act( async () => promise);
      wrapper.update();
    });
    it("Should render the 'ServiceFormHolder' component after 'EDIT' Button click action", () => {
      const editButton = wrapper.find(ServiceCard).at(0).find(".serviceCardEditBtn").at(0);
      // simulate click event and assert correct rendering //
      editButton.simulate("click");
      const serviceFormHolder = wrapper.find(ServiceFormContainer);
      expect(serviceFormHolder.length).toEqual(1);
    });
    it("Should render the '#serviceFormContainerDetails' component", () => {
      const detailsHolder = wrapper.find(ServiceFormContainer).render().find("#adminServiceFormContainerDetails");
      expect(detailsHolder.length).toEqual(1);
    });
    it("Should display yhe correct data in '.adminServiceFormContainerDetailsItem' <div>(s)", () => {
      const detailsDivs = wrapper.find(ServiceFormContainer).find(".adminServiceFormContainerDetailsItem");
      expect(detailsDivs.length).toEqual(3);
      expect(detailsDivs.at(0).render().find("p").html()).toEqual(mockServices[0].name);
      expect(detailsDivs.at(1).render().find("p").html()).toEqual(mockServices[0].price);
      expect(detailsDivs.at(2).render().find("p").html()).toEqual(mockServices[0].description);
    });
    it("Should correctly render the 'ServiceForm' component", () => {
      const serviceFormToggleBtn = wrapper.find(ServiceFormContainer).find("#adminServiceFormToggleBtn");
      // toggle form //
      serviceFormToggleBtn.at(0).simulate("click");
      // assert correct rendering //
      const serviceForm = wrapper.find(ServiceForm);
      expect(serviceForm.length).toEqual(1);
    });
    it("Should correctly render the 'currentService' data within thhe 'ServiceForm' component", () => {
      const currentService = mockServices[0];
      const nameInput = wrapper.find(ServiceForm).find("#adminServiceFormNameInput");
      const priceInput = wrapper.find(ServiceForm).find("#adminServiceFormPriceInput");
      const descriptionInput = wrapper.find(ServiceForm).find("#adminServiceFormDescInput");
      // assert correct rendering //
      expect(nameInput.props().value).toEqual(currentService.name);
      expect(priceInput.props().value)
    });
    it(`Should route to a correct client route: ${AdminServiceRoutes.EDIT_ROUTE}`, () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminServiceRoutes.EDIT_ROUTE);
    });
    it("Should correctly handle the '#adminServiceManageBackBtn' click and close 'ServiceFormHolder' component", () => {
      const backBtn = wrapper.find(ServiceManageHolder).find("#adminServiceManageBackBtn");
      backBtn.at(0).simulate("click");
      expect(wrapper.find(ServiceFormContainer).length).toEqual(0);
    });
    it(`Should route to a correct client route: ${AdminServiceRoutes.MANAGE_ROUTE}`, () => {
      const { history } = wrapper.find(Router).props();
      expect(history.location.pathname).toEqual(AdminServiceRoutes.MANAGE_ROUTE);
    });
  });
  // END ServiceCard EDIT button functionality //
  describe("'ServiceCard' component DELETE Button click action", () => {
    let wrapper: ReactWrapper;
    let mockDeletedService: IServiceData;
    window.scrollTo = jest.fn;

    beforeAll( async () => {
      const promise = Promise.resolve();
      moxios.install();
      moxios.stubRequest("/api/services", {
        status: 200,
        response: {
          responseMsg: "All ok",
          services: mockServices
        }
      });
      mockDeletedService = mockServices[0];
      // mount and update //
      wrapper = mount(
        <MemoryRouter initialEntries={[ AdminServiceRoutes.MANAGE_ROUTE ]} keyLength={0}>
          <TestStateProvider>
            <ServiceManageHolder />
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

    it("Should render 'Confirm' component after 'DELETE' Button click", () => {
      const deleteBtn = wrapper.find(ServiceCard).at(0).find(".serviceCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(ServiceCard).at(0).find(Confirm);
      // assert correct rendering//
      expect(confirmModal.props().open).toEqual(true);
      expect(confirmModal.find(Button).length).toEqual(2);
    });
    it("Sould correctly andle the {cancelServiceDeleteAction} methohd and update thhe local component state", () => {
      const deleteBtn = wrapper.find(ServiceCard).at(0).find(".serviceCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(ServiceCard).at(0).find(Confirm);
      // simulate cancel button click //
      confirmModal.find(Button).at(0).simulate("click");
      // assert correct rendering //
      expect(wrapper.find(ServiceCard).at(0).find(Confirm).props().open).toEqual(false);
      expect(wrapper.find(ServiceCard).length).toEqual(mockServices.length);
    });
    
    it("Should correctly handle {confirmServiceDeleteAction} method and correctly update local component state", async () => {
      const promise = Promise.resolve();
      moxios.stubRequest(`/api/services/delete/${mockServices[0]._id}`, {
        status: 200,
        response: {
          responseMsg: "All ok",
          deletedService: mockDeletedService
        }
      });
      // simulate te action //
      const deleteBtn = wrapper.find(ServiceCard).at(0).find(".serviceCardDeleteBtn");
      deleteBtn.at(0).simulate("click");
      const confirmModal = wrapper.find(ServiceCard).at(0).find(Confirm);
      // simulte confirm action click //
      confirmModal.find(Button).at(1).simulate("click");
      await act( async () => promise);
      // assert correct rerender //
      expect(moxios.requests.mostRecent().url).toEqual(`/api/services/delete/${mockServices[0]._id}`);
      expect(wrapper.find(ServiceCard).at(0).find(LoadingBar).length).toEqual(1);
    });
    
    it("Should NOT render the 'removed' 'ServiceCard' component", () => {
      wrapper.update();
      const serviceCards = wrapper.find(ServiceManageHolder).find(ServiceCard);
      serviceCards.forEach((serviceCard) => {
        expect(serviceCard.props().service._id).not.toEqual(mockDeletedService._id);
      });
    });
    it("Should rerender wit correct number of 'ServiceCard' components", () => {
      const servicesCards = wrapper.find(ServiceManageHolder).find(ServiceCard);
      expect(servicesCards.length).toEqual(mockServices.length - 1);
    });
    
  });
});