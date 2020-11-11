import React from "react"
import { Button } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
// client routing //
import { MemoryRouter as Router } from "react-router-dom";
// component imports //
import ServiceFormHolder from "../../../../components/admin_components/services/forms/ServiceFormContainer";
import ServiceForm from "../../../../components/admin_components/services/forms/ServiceForm";
import ServiceImageUplForm from "../../../../components/admin_components/services/forms/ServiceImgUplForm";
import ServiceImgPreviewHolder from "../../../../components/admin_components/services/image_preview/ServiceImgPreviewContainer";
import ServiceImgPreviewThumb from "../../../../components/admin_components/services/image_preview/ServiceImgThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, StateProvider, TestStateProvider } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("ServiceFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <ServiceFormHolder />
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find(ServiceFormHolder)).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find("#serviceFormToggleBtn");
      expect(toggleButton.length).toEqual(1);
    });

  });
  
  // TEST Form Holder state OPEN - NO Current Service Data //
  describe("Form Holder state OPEN - NO Current Service Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <StateProvider>
            <ServiceFormHolder />
          </StateProvider>
        </Router>
      );
      wrapper.find(ServiceFormHolder).find("#serviceFormToggleBtn").at(0).simulate("click");
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#serviceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT render '#serviceFormHolderDetails'", () => {
      const formDetails = wrapper.find(ServiceFormHolder).render().find("#serviceFormHolderDetails");
      expect(formDetails.length).toEqual(0);
    })
    it("Should properly render FormHolder, respond to '#serviceToggleBtn' click", () => {
      // open button clicked //
      expect(wrapper.find(ServiceFormHolder)).toMatchSnapshot();
    });
  
    it("Should render a '#adminServiceFormCreate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#adminServiceFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT render a '#adminServiceFormUpdate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#adminServiceFormUpdate');
      expect(toggleButton.length).toEqual(0);
    });
    it("Should have the Form rendered after toggle button", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(ServiceImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(ServiceImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });
  });
  
  // END Form Holder state OPEN - NO Current Service Data //
  // TEST Form Holder state OPEN - WITH Current Service Data - NO IMAGES //
  describe("Form Holder state OPEN - WITH Current Service Data - NO IMAGES",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;
    let mockService: IServiceData;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      mockService = {
        _id: "1",
        name: "name",
        price: "100",
        description: "description",
        images: [],
        createdAt: "now"
      };
      state.serviceState.currentServiceData = mockService;
      // mount and open form // 
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider mockState={state}>
            <ServiceFormHolder />
          </TestStateProvider>
        </Router>
      );
      wrapper.find(ServiceFormHolder).find("#serviceFormToggleBtn").at(0).simulate("click");
    });

    it("Should properly render ServiceFormHolder component", () => {
      expect(wrapper.find(ServiceFormHolder)).toMatchSnapshot();
      expect(wrapper.find("#serviceFormHolder").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#serviceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(1);
    });
    it("Should render '#serviceFormDetails'", () => {
      const serviceFormDetails = wrapper.find(ServiceFormHolder).render().find("#serviceFormHolderDetails");
      expect(serviceFormDetails.length).toEqual(1);
    });
    it("Should correctly render '.serviceFormHolderDetailsItem' <divs> and their data", () => {
      const serviceDetails = wrapper.find(ServiceFormHolder).find(".serviceFormHolderDetailsItem");
      expect(serviceDetails.length).toEqual(3);
      expect(serviceDetails.at(0).find("p").text()).toEqual(mockService.name);
      expect(serviceDetails.at(1).find("p").text()).toEqual(mockService.price);
      expect(serviceDetails.at(2).find("p").text()).toEqual(mockService.description);
    });
    it("Should render a '#adminServiceFormUpdate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#adminServiceFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT have a '#adminServiceFormCreate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#adminServiceFormCreate');
      expect(toggleButton.length).toEqual(0);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(ServiceImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
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
  
  // END Form Holder state OPEN - WITH Current Service Data - NO IMAGES //
  // TEST Form Holder state OPEN - WITH Current Service Data - WITH IMAGES //
  describe("Form Holder state OPEN - WITH Current Service Data - WITH IMAGES",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;
    let mockService: IServiceData;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      mockService = {
        _id: "1",
        name: "name",
        price: "100",
        description: "description",
        images: [
          {
            _id: "1",
            description: "desc",
            url: "url",
            absolutePath: "path",
            fileName: "img",
            imagePath: "imgPath",
            createdAt: "now"
          },
          {
            _id: "2",
            description: "desc",
            url: "url",
            absolutePath: "path",
            fileName: "img",
            imagePath: "imgPath",
            createdAt: "now"
          },
        ],
        createdAt: "now"
      };
      state.serviceState.currentServiceData = mockService;
      // mpunt with mock state //
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider mockState={state}>
            <ServiceFormHolder />
          </TestStateProvider>
        </Router>
      );
      wrapper.find(ServiceFormHolder).find("#serviceFormToggleBtn").at(0).simulate("click");
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find(ServiceFormHolder)).toMatchSnapshot();
      expect(wrapper.find("#serviceFormHolder").length).toEqual(1);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#serviceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(1);
    });
    it("Should render '#serviceFormDetails'", () => {
      const serviceFormDetails = wrapper.find(ServiceFormHolder).render().find("#serviceFormHolderDetails");
      expect(serviceFormDetails.length).toEqual(1);
    });
    it("Should correctly render '.serviceFormHolderDetailsItem' <divs> and their data", () => {
      const serviceDetails = wrapper.find(ServiceFormHolder).find(".serviceFormHolderDetailsItem");
      expect(serviceDetails.length).toEqual(3);
      expect(serviceDetails.at(0).find("p").text()).toEqual(mockService.name);
      expect(serviceDetails.at(1).find("p").text()).toEqual(mockService.price);
      expect(serviceDetails.at(2).find("p").text()).toEqual(mockService.description);
    });
    it("Should have a '#adminServiceFormUpdate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#adminServiceFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should NOT have a '#adminServiceFormCreate' Button", () => {
      const toggleButton = wrapper.find(ServiceFormHolder).render().find('#adminServiceCreate');
      expect(toggleButton.length).toEqual(0);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(ServiceImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
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
  // END Form Holder state OPEN - WITH Current Service Data - WITH IMAGES //
  // TEST Form Holder state OPEN - MOCK Submit action //
  /*
  describe("Form Holder state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll( async () => {
      window.scrollTo = jest.fn();
      // mount and wait //
      wrapper = mount(
        <Router initialEntries={["/admin/services/create"]} >
          <TestStateProvider>
            <ServiceFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should have a submit button", () => {
      wrapper.update();
      wrapper.find("#serviceFormToggleBtn").at(0).simulate("click").update();
      const adminServiceFormCreate = wrapper.find("#adminServiceFormCreate").at(0);
      expect(adminServiceFormCreate.length).toEqual(1)
    });
    it("Should handle the 'handleCreateServiceAction, show 'LoadingBar' Component", async () => {
      moxios.install();
      await act( async () => {
        moxios.stubRequest("/api/services/create", {
          status: 200,
          response: {
            responseMsg: "All Good",
            newService: createMockServices(1)[0]
          }
        });
        const adminServiceFormCreate = wrapper.find("#adminServiceFormCreate").at(0);
        adminServiceFormCreate.simulate("click");
        //expect(wrapper.find(LoadingBar).length).toEqual(1);
      });
      // expect(sinon.spy(createService)).toHaveBeenCalled()
      wrapper.update();
    });
    it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    it("Should NOT show the 'ServiceForm' Component after successful API call", () => {
      expect(wrapper.find(ServiceForm).length).toEqual(0);
    });
    // END Form Holder state OPEN - MOCK Submit action //
  });
  */
});