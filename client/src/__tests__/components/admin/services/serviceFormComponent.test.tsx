import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { Button } from "semantic-ui-react";
// component imports //
import ServiceFormHolder from "../../../../components/admin_components/services/forms/ServiceFormHolder";
import ServiceForm from "../../../../components/admin_components/services/forms/ServiceForm";
import ServiceImageUplForm from "../../../../components/admin_components/services/forms/ServiceImgUplForm";
import ServiceImgPreviewHolder from "../../../../components/admin_components/services/image_preview/ServiceImgPreviewHolder";
import ServiceImgPreviewThumb from "../../../../components/admin_components/services/image_preview/ServiceImgThumb";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { setMockServiceState } from "../../../../test_helpers/serviceHelpers";
import { IGlobalAppState } from "../../../../state/Store";

describe("ServiceFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount<{}, typeof ServiceFormHolder>(<ServiceFormHolder state={generateCleanState()} dispatch={jest.fn<React.Dispatch<ServiceAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    })
  });

  describe("Form Holder state OPEN - NO Current Service Data",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount<{}, typeof ServiceFormHolder>(<ServiceFormHolder state={generateCleanState()} dispatch={jest.fn<React.Dispatch<ServiceAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      const toggleButton = wrapper.find("#serviceFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      expect(wrapper.html()).toBeDefined();

    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#serviceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.render().find('#adminServiceFormCreate');
      expect(toggleButton.length).toEqual(1);
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

  describe("Form Holder state OPEN - WITH Current Service Data - NO IMAGES",  () => {
    let state: IGlobalAppState;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockServiceState({ currentService: true });
      wrapper = mount<{}, typeof ServiceFormHolder>(<ServiceFormHolder state={state} dispatch={jest.fn<React.Dispatch<ServiceAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#serviceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminServiceFormUpdate');
      expect(toggleButton.length).toEqual(1);
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

  describe("Form Holder state OPEN - WITH Current Service Data - WITH IMAGES",  () => {
    let state: IGlobalAppState;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockServiceState({ currentService: true, serviceImages: 3 });
      wrapper = mount<{}, typeof ServiceFormHolder>(<ServiceFormHolder state={state} dispatch={jest.fn<React.Dispatch<ServiceAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#serviceFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(ServiceForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminServiceFormUpdate');
      expect(toggleButton.length).toEqual(1);
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

});