import React, { Component } from "react";
import { mount, ReactWrapper } from "enzyme";
// component imports //
import StoreFormHolder from "../../../../components/admin_components/stores/forms/StoreFormHolder";
import { IGlobalAppState } from "../../../../state/Store";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import StoreForm from "../../../../components/admin_components/stores/forms/StoreForm";
import { Button } from "semantic-ui-react";
import StoreImageUplForm from "../../../../components/admin_components/stores/forms/StoreImageUplForm";
import StoreImgPreviewHolder from "../../../../components/admin_components/stores/image_preview/StoreImgPreviewThumbs";

describe("StoreFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  beforeAll(() => {
    window.scrollTo = jest.fn();
    wrapper = mount<{}, typeof StoreFormHolder>(<StoreFormHolder state={generateCleanState()} dispatch={jest.fn<React.Dispatch<StoreAction>, []>()}/>)
  })
  describe("Default Form Holder state",  () => {
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
    it("Should have the Form defined", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview open", () => {
      const imgPreviewHolder = wrapper.find(StoreImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form open", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });

  });

  describe("Form Holder state OPEN - WITH Current Store Data",  () => {
   
    it("Should Properly Mount Form Holder", () => {
      const toggleButton = wrapper.find(Button);
      toggleButton.simulate("click")
      // open button clicked //
      expect(wrapper.html()).toBeDefined();
      console.log(wrapper.props())
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#storeFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.render().find('#adminStoreFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form defined", () => {
      const form = wrapper.find(StoreForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview open", () => {
      const imgPreviewHolder = wrapper.find(StoreImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form open", () => {
      const imgUploadForm = wrapper.find(StoreImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });

  })
});