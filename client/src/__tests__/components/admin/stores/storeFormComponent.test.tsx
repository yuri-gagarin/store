import React, { Component } from "react";
import { mount, ReactWrapper } from "enzyme";
// component imports //
import StoreFormHolder from "../../../../components/admin_components/stores/forms/StoreFormHolder";
import StoreImageUplForm from "../../../../components/admin_components/stores/forms/StoreImageUplForm";
import StoreImgPreviewHolder, { StoreImgPreviewThumb } from "../../../../components/admin_components/stores/image_preview/StoreImgPreviewThumbs";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { setMockStoreState } from "../../../../test_helpers/storeHelpers";
import StoreForm from "../../../../components/admin_components/stores/forms/StoreForm";
import { Button } from "semantic-ui-react";
import { IGlobalAppState } from "../../../../state/Store";

describe("StoreFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount<{}, typeof StoreFormHolder>(<StoreFormHolder state={generateCleanState()} dispatch={jest.fn<React.Dispatch<StoreAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    })
  });

  describe("Form Holder state OPEN - NO Current Store Data",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount<{}, typeof StoreFormHolder>(<StoreFormHolder state={generateCleanState()} dispatch={jest.fn<React.Dispatch<StoreAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      const toggleButton = wrapper.find("#storeFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      expect(wrapper.html()).toBeDefined();

    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered after toggle button", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });

  });

  describe("Form Holder state OPEN - WITH Current Store Data - NO IMAGES",  () => {
    let state: IGlobalAppState;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreState({ currentStore: true });
      wrapper = mount<{}, typeof StoreFormHolder>(<StoreFormHolder state={state} dispatch={jest.fn<React.Dispatch<StoreAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
    });
    it("Should NOT render any preview images", () => {
      const previewThumb = wrapper.find(StoreImgPreviewThumb);
      expect(previewThumb.length).toEqual(0);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });

  });

  describe("Form Holder state OPEN - WITH Current Store Data - WITH IMAGES",  () => {
    let state: IGlobalAppState;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockStoreState({ currentStore: true, storeImages: 3 });
      wrapper = mount<{}, typeof StoreFormHolder>(<StoreFormHolder state={state} dispatch={jest.fn<React.Dispatch<StoreAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(StoreImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
    });
    it("Should render a correct number of preview images", () => {
      const previewThumb = wrapper.find(StoreImgPreviewThumb);
      const numberOfImages = state.storeState.currentStoreData.images.length;
      expect(previewThumb.length).toEqual(numberOfImages);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });
  
});