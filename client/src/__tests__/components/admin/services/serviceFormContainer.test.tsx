import React from "react"
import { Button, Icon } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter, Router } from "react-router-dom";
// component imports //
import ServiceFormContainer from "../../../../components/admin_components/services/forms/ServiceFormContainer";
import ServiceForm from "../../../../components/admin_components/services/forms/ServiceForm";
import ServiceImageUplForm from "../../../../components/admin_components/services/forms/ServiceImgUplForm";
import ServiceImgPreviewContainer from "../../../../components/admin_components/services/image_preview/ServiceImgPreviewContainer";
import ServiceImgPreviewThumb from "../../../../components/admin_components/services/image_preview/ServiceImgThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, StateProvider, TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { AdminServiceRoutes } from "../../../../routes/adminRoutes";
import ErrorBar from "../../../../components/admin_components/miscelaneous/ErrorBar";

describe("ServiceFormContainer Component tests", () => {
  let wrapper: ReactWrapper; 
  let mockService: IServiceData;
  const mockDate: string = new Date("1/1/2019").toString();
  
  beforeAll(() => {
    mockService = {
      _id: "1",
      name: "name",
      price: "100",
      description: "description",
      images: [],
      createdAt: mockDate
    };
  });
  
  describe("Default 'ServiceFormContainer' state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <ServiceFormContainer />
        </MemoryRouter>
      );
    });

    it("Should properly mount 'ServiceFormContainer'", () => {
      expect(wrapper.find(ServiceFormContainer)).toMatchSnapshot();
    });
    it("'ServiceForm' should be closed by default", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(0);
    });
    it("Should render a 'ServiceForm' toggle Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find("#adminServiceFormToggleBtn");
      expect(toggleButton.length).toEqual(1);
    });

  });
  
  // TEST Form Container state OPEN - NO Current Service Data //
  describe("'ServiceFormContainer' with 'ServiceForm' OPEN - NO Current Service Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <StateProvider>
            <ServiceFormContainer />
          </StateProvider>
        </MemoryRouter>
      );
      wrapper.find(ServiceFormContainer).find("#adminServiceFormToggleBtn").at(0).simulate("click");
    });
    it("Should have a 'ServiceForm' toggle Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT render '#serviceFormContainerDetails'", () => {
      const formDetails = wrapper.find(ServiceFormContainer).render().find("#serviceFormContainerDetails");
      expect(formDetails.length).toEqual(0);
    })
    it("Should properly render FormContainer, respond to '#serviceToggleBtn' click", () => {
      // open button clicked //
      expect(wrapper.find(ServiceFormContainer)).toMatchSnapshot();
    });
  
    it("Should render a '#adminServiceFormCreate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT render a '#adminServiceFormUpdate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceFormUpdate');
      expect(toggleButton.length).toEqual(0);
    });
    it("Should have the 'ServiceForm' rendered after toggle button", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(ServiceImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(ServiceImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });
  });
  // END Form Container state OPEN - NO Current Service Data //
  // TEST Form Container state OPEN - WITH Current Service Data - NO IMAGES //
  describe("'ServiceFormContainer' 'ServiceForm' OPEN - WITH Current Service Data - NO IMAGES",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      state.serviceState.currentServiceData = { ...mockService };
      // mount and open form // 
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider mockState={state}>
            <ServiceFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
      wrapper.update();
      wrapper.find(ServiceFormContainer).find("#adminServiceFormToggleBtn").at(0).simulate("click");
    });

    it("Should properly render 'ServiceFormContainer' component", () => {
      expect(wrapper.find(ServiceFormContainer)).toMatchSnapshot();
      expect(wrapper.find("#serviceFormContainer").length).toEqual(1);
    });
    it("Should have a 'ServiceForm' toggle Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the 'ServiceForm' rendered", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(1);
    });
    it("Should render '#serviceFormDetails'", () => {
      const serviceFormDetails = wrapper.find(ServiceFormContainer).render().find("#serviceFormContainerDetails");
      //console.log(wrapper.find(ServiceFormContainer).debug())
      expect(serviceFormDetails.length).toEqual(1);
    });
    it("Should correctly render '.serviceFormContainerDetailsItem' <divs> and their data", () => {
      const serviceDetails = wrapper.find(ServiceFormContainer).find(".serviceFormContainerDetailsItem");
      expect(serviceDetails.length).toEqual(3);
      expect(serviceDetails.at(0).find("p").text()).toEqual(mockService.name);
      expect(serviceDetails.at(1).find("p").text()).toEqual(mockService.price);
      expect(serviceDetails.at(2).find("p").text()).toEqual(mockService.description);
    });
    it("Should render a '#adminServiceFormUpdate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT have a '#adminServiceFormCreate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceFormCreate');
      expect(toggleButton.length).toEqual(0);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(ServiceImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(1);
    });
    it("Should NOT render any preview images", () => {
      const previewThumb = wrapper.find(ServiceImgPreviewThumb);
      expect(previewThumb.length).toEqual(0);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(ServiceImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });
  // END Form Container state OPEN - WITH Current Service Data - NO IMAGES //
  // TEST Form Container state OPEN - WITH Current Service Data - WITH IMAGES //
  describe("Form Container state OPEN - WITH Current Service Data - WITH IMAGES",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      mockService.images = [
        {
          _id: "1",
          description: "desc",
          url: "url",
          absolutePath: "path",
          fileName: "img",
          imagePath: "imgPath",
          createdAt: mockDate
        },
        {
          _id: "2",
          description: "desc",
          url: "url",
          absolutePath: "path",
          fileName: "img",
          imagePath: "imgPath",
          createdAt: mockDate
        },
      ];
      state.serviceState.currentServiceData = { ...mockService };
      // mpunt with mock state //
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider mockState={state}>
            <ServiceFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
      wrapper.find(ServiceFormContainer).find("#adminServiceFormToggleBtn").at(0).simulate("click");
    });

    it("Should properly mount the  'ServiceFormContainer'", () => {
      expect(wrapper.find(ServiceFormContainer)).toMatchSnapshot();
      expect(wrapper.find("#serviceFormContainer").length).toEqual(1);
    });
    it("Should have a 'ServiceForm' toggle Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the 'ServiceForm' rendered", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(1);
    });
    it("Should render '#serviceFormDetails'", () => {
      const serviceFormDetails = wrapper.find(ServiceFormContainer).render().find("#serviceFormContainerDetails");
      expect(serviceFormDetails.length).toEqual(1);
    });
    it("Should correctly render '.serviceFormContainerDetailsItem' <divs> and their data", () => {
      const serviceDetails = wrapper.find(ServiceFormContainer).find(".serviceFormContainerDetailsItem");
      expect(serviceDetails.length).toEqual(3);
      expect(serviceDetails.at(0).find("p").text()).toEqual(mockService.name);
      expect(serviceDetails.at(1).find("p").text()).toEqual(mockService.price);
      expect(serviceDetails.at(2).find("p").text()).toEqual(mockService.description);
    });
    it("Should have a '#adminServiceFormUpdate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT have a '#adminServiceFormCreate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormContainer).render().find('#adminServiceCreate');
      expect(toggleButton.length).toEqual(0);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(ServiceImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(1);
    });
    it("Should render a correct number of preview images", () => {
      const previewThumb = wrapper.find(ServiceImgPreviewThumb);
      const numberOfImages = state.serviceState.currentServiceData.images.length;
      expect(previewThumb.length).toEqual(numberOfImages);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(ServiceImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });
  
  // END Form Container state OPEN - WITH Current Service Data - WITH IMAGES //
  // TEST Form Container state OPEN - MOCK Submit action //
  describe("'ServiceFormContainer' state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    // TEST 'ServiceFormContainer' NEW FORM SUBMIT SUCCESS //
    describe("'ServiceFormContainer' 'ServiceForm' OPEN - NEW FORM - mock SUBMIT SUCCESS", () => {

      beforeAll( async () => {
        window.scrollTo = jest.fn();
        state = generateCleanState();
        // mount and wait //
        wrapper = mount(
          <MemoryRouter initialEntries={[ AdminServiceRoutes.CREATE_ROUTE ]} keyLength={0} >
            <TestStateProvider mockState={state}>
              <ServiceFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
      });
      afterAll(() => {
        moxios.uninstall();
      });

      it("Should render a submit button", () => {
        wrapper.find("#adminServiceFormToggleBtn").at(0).simulate("click").update();
        // set mock values //
        const serviceNameInput = wrapper.find(ServiceForm).find("#adminServiceFormNameInput");
        const servicePriceInput = wrapper.find(ServiceForm).find("#adminServiceFormPriceInput");
        const serviceDescInput = wrapper.find(ServiceForm).find("#adminServiceFormDescInput");
        // simulate input //
        serviceNameInput.simulate("change", { target: { value: mockService.name } });
        servicePriceInput.simulate("change", { target: { value: mockService.price } });
        serviceDescInput.at(1).simulate("change", { target: { value: mockService.description } });
        // assert correct rendering //
        const adminServiceFormCreate = wrapper.find("#adminServiceFormCreateBtn").at(0);
        expect(adminServiceFormCreate.length).toEqual(1)
      });

      it("Should handle the 'handleCreateServiceAction, show 'LoadingBar' Component", async () => {
        const promise = Promise.resolve();
        moxios.install();
        moxios.stubRequest("/api/services/create", {
          status: 200,
          response: {
            responseMsg: "All Good",
            newService: mockService
          }
        });
        const adminServiceFormCreate = wrapper.find("#adminServiceFormCreateBtn").at(0);
        adminServiceFormCreate.simulate("click");

        await act( async () => promise);
        // assert correct rendering //
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
        wrapper.update();
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(0);
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT show the 'ServiceForm' Component after successful API call", () => {
        expect(wrapper.find(ServiceForm).length).toEqual(0);
      });
      it("Should render correct values in '#adminServiceFormContainerDetails'", () => {
        const detailsContainers = wrapper.find(ServiceFormContainer).find(".adminServiceFormContainerDetailsItem");
        expect(detailsContainers.at(0).find("p").render().text()).toEqual(mockService.name);
        expect(detailsContainers.at(1).find("p").render().text()).toEqual(mockService.price);
        expect(detailsContainers.at(2).find("p").render().text()).toEqual(mockService.description);
      });
      it(`Should NOT change the client route: ${AdminServiceRoutes.CREATE_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminServiceRoutes.CREATE_ROUTE);
      });
      // END Form Container state OPEN - MOCK Submit action //
    });
    // END TEST 'ServiceFormContainer' NEW FORM SUBMIT SUCCESS //
    // TEST 'ServiceFormContainer' NEW FORM SUBMIT ERROR //
    describe("'ServiceFormContainer' 'ServiceForm' OPEN - NEW FORM - mock SUBMIT ERROR", () => {
      let state: IGlobalAppState; let wrapper: ReactWrapper;
      const error = new Error("An error occured");

      beforeAll( async () => {
        window.scrollTo = jest.fn;
        const state = generateCleanState();
        // mount and wait //
        wrapper = mount(
          <MemoryRouter keyLength={0} initialEntries={[ AdminServiceRoutes.CREATE_ROUTE ]}>
            <TestStateProvider mockState={state}>
              <ServiceFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
      });
      afterAll(() => {
        moxios.uninstall();
      });

      it("Should render 'ServiceForm' component and the submit button", () => {
        const toggleBtn = wrapper.find(ServiceFormContainer).find("#adminServiceFormToggleBtn");
        toggleBtn.at(0).simulate("click");
        // set mock values //
        const serviceNameInput = wrapper.find(ServiceForm).find("#adminServiceFormNameInput");
        const servicePriceInput = wrapper.find(ServiceForm).find("#adminServiceFormPriceInput");
        const serviceDescInput = wrapper.find(ServiceForm).find("#adminServiceFormDescInput");
        // simulate input //
        serviceNameInput.simulate("change", { target: { value: mockService.name } });
        servicePriceInput.simulate("change", { target: { value: mockService.price } });
        serviceDescInput.at(1).simulate("change", { target: { value: mockService.description } });
        // assert correct rendering //
        const adminServiceFormCreate = wrapper.find("#adminServiceFormCreateBtn").at(0);
        expect(adminServiceFormCreate.length).toEqual(1);
      });
      it("Should handle the 'handleServiceCreateAction', render 'LoadingBar' component", async () => {
        const promise = Promise.resolve();
        const url = `/api/services/create`;
        moxios.install();
        moxios.stubRequest(url, {
          status: 500,
          response: {
            responseMsg: "Error",
            error: error
          }
        });
        const createBtn = wrapper.find(ServiceFormContainer).find("#adminServiceFormCreateBtn");
        createBtn.at(0).simulate("click");

        await act( async () => promise);
        // assert correct rendering //
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(0);
        expect(moxios.requests.mostRecent().url).toEqual(url);
      });
      it("Should NOT render the 'LoadingBar' component after an error in API call", () => {
        wrapper.update();
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(0);
      });
      it("Should render the 'ErrorBar' component after an error in API call", () => {
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(1);
      });
      it("Should render the 'ServiceForm' component after an error in API call", () => {
        expect(wrapper.find(ServiceFormContainer).find(ServiceForm).length).toEqual(1);
      });
      it("Should NOT render the '#adminServiceFormContainerDetails' <div>", () => {
        expect(wrapper.find(ServiceFormContainer).find("#adminServiceFormContainerDetails").length).toEqual(0);
      });
      it("Should properly dismiss the 'ErrorBar' component with button click", () => {
        const dismissErrorIcon = wrapper.find(ServiceFormContainer).find(ErrorBar).find(Icon);
        // simulate the dismissErrorIcon click //
        dismissErrorIcon.simulate("click");
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(0);
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(0);
      });
      it("Should NOT reset the input values of 'ServiceForm' component", () => {
        const nameInput = wrapper.find(ServiceForm).find("#adminServiceFormNameInput");
        const priceInput = wrapper.find(ServiceForm).find("#adminServiceFormPriceInput");
        const descInput = wrapper.find(ServiceForm).find("#adminServiceFormDescInput");
        // assert correct rendering //
        expect(nameInput.props().value).toEqual(mockService.name);
        expect(priceInput.props().value).toEqual(mockService.price);
        expect(descInput.at(0).props().value).toEqual(mockService.description);
      });
      it(`Should NOT change the client route: ${AdminServiceRoutes.CREATE_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminServiceRoutes.CREATE_ROUTE);
      });
    });
    // END TEST 'ServiceFormContainer' NEW FORM SUBMIT ERROR //
  });
  // END TEST Form Container state OPEN - NEW FORM - MOCK Submit action //
  // TEST Form Container state OPEN - CURRENT SERVICE DATA - MOCK Submit action //
  // TEST ServiceFormContainer state OPEN - CURRENT SERVICE DATA - MOCK Submit action //
  describe("'ServiceFormContainer' 'ServiceForm' OPEN - CURRENT SERVICE DATA - mock Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    // TEST 'ServiceFormContainer' NEW FORM mock SUBMIT SUCCESS //
    describe("'ServiceFormContainer' 'ServiceForm' OPEN - NEW FORM - mock SUBMIT SUCCESS", () => {

      beforeAll( async () => {
        window.scrollTo = jest.fn();
        state = generateCleanState();
        state.serviceState.currentServiceData = { ...mockService };
        // mount and wait //
        wrapper = mount(
          <MemoryRouter initialEntries={[ AdminServiceRoutes.EDIT_ROUTE ]} keyLength={0} >
            <TestStateProvider mockState={state}>
              <ServiceFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
      });
      afterAll(() => {
        moxios.uninstall();
      });
      
      it("Should have a '#adminServiceFormUpdateBtn' button", () => {
        wrapper.find("#adminServiceFormToggleBtn").at(0).simulate("click");
        const adminServiceFormUpdate = wrapper.find("#adminServiceFormUpdateBtn").at(0);
        expect(adminServiceFormUpdate.length).toEqual(1)
      });
      
      it("Should handle the 'handleUpdateServiceAction' show 'LoadingBar' Component", async () => {
        const promise = Promise.resolve();
        moxios.install();
        moxios.stubRequest(`/api/services/update/${mockService._id}`, {
          status: 200,
          response: {
            responseMsg: "All Good",
            editedService: mockService
          }
        });
        const adminServiceFormUpdate = wrapper.find("#adminServiceFormUpdateBtn").at(0);
        adminServiceFormUpdate.simulate("click");
        
        await act( async () => promise);
        // assert correct rendering //
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(0);
        
      });
    
      it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
        wrapper.update();
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(0);
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT show the 'ServiceForm' Component after successful API call", () => {
        expect(wrapper.find(ServiceForm).length).toEqual(0);
      });
      it("Shohuld correctly render '#adminServiceFormContainerDetails' 'Grid' item", () => {
        const storeDetails = wrapper.find(ServiceFormContainer).render().find("#adminServiceFormContainerDetails");
        expect(storeDetails.length).toEqual(1);
      });
      it("Should render correct values in '#adminServiceFormContainerDetails'", () => {
        const detailsContainers = wrapper.find(ServiceFormContainer).find(".adminServiceFormContainerDetailsItem");
        expect(detailsContainers.at(0).find("p").render().text()).toEqual(mockService.name);
        expect(detailsContainers.at(1).find("p").render().text()).toEqual(mockService.price);
        expect(detailsContainers.at(2).find("p").render().text()).toEqual(mockService.description);
      });
      it(`Should NOT change the client route: ${AdminServiceRoutes.EDIT_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminServiceRoutes.EDIT_ROUTE);
      });
    
    });
    // END TEST 'ServiceFormContainer' CURRENT_SERVICE_DATA mock SUBMIT SUCCESS //
    // TEST 'ServiceFormContainer' CURRENT_SERVICE_DATA mock SUBMIT ERROR //
    describe("'ServiceFormContainer' 'ServiceForm' state OPEN - CURRENT_SERVICE_DATA - MOCK Submit action ERROR returned",  () => {
      let wrapper: ReactWrapper; let state: IGlobalAppState;
      const error = new Error("Am error occured");
  
      beforeAll( async () => {
        window.scrollTo = jest.fn();
        state = generateCleanState();
        state.serviceState.currentServiceData = { ...mockService }
        // mount and wait //
        wrapper = mount(
          <MemoryRouter initialEntries={[ AdminServiceRoutes.EDIT_ROUTE ]} keyLength={0} >
            <TestStateProvider mockState={state}>
              <ServiceFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
        // set form values //
      });
      afterAll(() => {
        moxios.uninstall();
      });

      it("Should render 'ServiceForm' and the submit button", () => {
        const toggleBtn = wrapper.find(ServiceFormContainer).find("#adminServiceFormToggleBtn");
        toggleBtn.at(0).simulate("click");
        // assert correct rendering //
        const adminServiceFormCreate = wrapper.find("#adminServiceFormUpdateBtn").at(0);
        expect(adminServiceFormCreate.length).toEqual(1)
      })
      
      it("Should handle the 'handleUpdateServiceAction' show 'LoadingBar' Component", async () => {
        const promise = Promise.resolve();
        const url = `/api/services/update/${mockService._id}`
        moxios.install();
        moxios.stubRequest(url, {
          status: 500,
          response: {
            responseMsg: "Error",
            error: error
          }
        });
        const adminServiceFormCreate = wrapper.find("#adminServiceFormUpdateBtn").at(0);
        adminServiceFormCreate.simulate("click");

        await act( async () => promise);
        // assert correct rendering //
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(0);
        expect(moxios.requests.mostRecent().url).toEqual(url);
      });
      it("Should NOT render the 'LoadingBar' Component after an error in API call", () => {
        wrapper.update();
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(0);
      });
      it("Should render the 'ErrorBar' Component after an error in API call", () => {
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(1);
      });
      it("Should show the 'ServiceForm' Component after an error in API call", () => {
        expect(wrapper.find(ServiceForm).length).toEqual(1);
      });
      it("Should render the '#adminServiceFormContainerDetails' <div>", () => {
        expect(wrapper.find(ServiceFormContainer).render().find("#adminServiceFormContainerDetails").length).toEqual(1);
      });
      it("Should render correct data in the '#adminStorFormContainerDetails <div>", () => {
        const detailsItems = wrapper.find(ServiceFormContainer).find(".adminServiceFormContainerDetailsItem");
        expect(detailsItems.length).toEqual(3);
        expect(detailsItems.at(0).find("p").render().html()).toEqual(mockService.name);
        expect(detailsItems.at(1).find("p").render().html()).toEqual(mockService.price);
        expect(detailsItems.at(2).find("p").render().html()).toEqual(mockService.description);
      });
      it("Should properly dissmiss the 'ErrorBar' component with button click", () => {
        const dismissErrorIcon = wrapper.find(ServiceFormContainer).find(ErrorBar).find(Icon);
        // simulate the dismissErrorIcon click //
        dismissErrorIcon.simulate("click");
        expect(wrapper.find(ServiceFormContainer).find(ErrorBar).length).toEqual(0);
        expect(wrapper.find(ServiceFormContainer).find(LoadingBar).length).toEqual(0);
      });
      it("Should NOT reset input values of 'ServiceForm' inputs", () => {
        const nameInput = wrapper.find(ServiceForm).find("#adminServiceFormNameInput");
        const priceInput = wrapper.find(ServiceForm).find("#adminServiceFormPriceInput");
        const descInput = wrapper.find(ServiceForm).find("#adminServiceFormDescInput");
        // assert correct rendering //
        expect(nameInput.props().value).toEqual(mockService.name);
        expect(priceInput.props().value).toEqual(mockService.price);
        expect(descInput.at(0).props().value).toEqual(mockService.description);
      });
      it(`Should NOT change the client route: ${AdminServiceRoutes.EDIT_ROUTE}`, () => {
        const { history } = wrapper.find(Router).props();
        expect(history.location.pathname).toEqual(AdminServiceRoutes.EDIT_ROUTE);
      });
    
    });
    // END TEST ServiceFormContainer mock submit action with an API error returned //
  });
  // END TEST
});