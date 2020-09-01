import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { Button } from "semantic-ui-react";
// component imports //
import ProductFormHolder from "../../../../components/admin_components/products/forms/ProductFormHolder";
import ProductForm from "../../../../components/admin_components/products/forms/ProductForm";
import ProductImageUplForm from "../../../../components/admin_components/products/forms/ProductImgUplForm";
import ProductImgPreviewHolder from "../../../../components/admin_components/products/image_preview/ProductImgPreviewHolder";
import ProductImgPreviewThumb from "../../../../components/admin_components/products/image_preview/ProductImgThumb";
// helpers //
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { setMockProductState } from "../../../../test_helpers/productHelpers";
import { IGlobalAppState } from "../../../../state/Store";

describe("ProductFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount<{}, typeof ProductFormHolder>(<ProductFormHolder state={generateCleanState()} dispatch={jest.fn<React.Dispatch<ProductAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    })
  });

  describe("Form Holder state OPEN - NO Current Product Data",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount<{}, typeof ProductFormHolder>(<ProductFormHolder state={generateCleanState()} dispatch={jest.fn<React.Dispatch<ProductAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      const toggleButton = wrapper.find("#productFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      expect(wrapper.html()).toBeDefined();

    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.render().find('#adminProductFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered after toggle button", () => {
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(ProductImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(ProductImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });

  });

  describe("Form Holder state OPEN - WITH Current Product Data - NO IMAGES",  () => {
    let state: IGlobalAppState;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockProductState({ currentProduct: true });
      wrapper = mount<{}, typeof ProductFormHolder>(<ProductFormHolder state={state} dispatch={jest.fn<React.Dispatch<ProductAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminProductFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(ProductImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
    });
    it("Should NOT render any preview images", () => {
      const previewThumb = wrapper.find(ProductImgPreviewThumb);
      expect(previewThumb.length).toEqual(0);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(ProductImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });

  });

  describe("Form Holder state OPEN - WITH Current Product Data - WITH IMAGES",  () => {
    let state: IGlobalAppState;
    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockProductState({ currentProduct: true, productImages: 3 });
      wrapper = mount<{}, typeof ProductFormHolder>(<ProductFormHolder state={state} dispatch={jest.fn<React.Dispatch<ProductAction>, []>()}/>)
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.html()).toBeDefined();
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(1);
    });
    it("Should have a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminProductFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Image Preview rendered", () => {
      const imgPreviewHolder = wrapper.find(ProductImgPreviewHolder);
      expect(imgPreviewHolder.length).toEqual(1);
    });
    it("Should render a correct number of preview images", () => {
      const previewThumb = wrapper.find(ProductImgPreviewThumb);
      const numberOfImages = state.productState.currentProductData.images.length;
      expect(previewThumb.length).toEqual(numberOfImages);
    })
    it("Should have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(ProductImageUplForm);
      expect(imgUploadForm.length).toEqual(1);
    });
  });

});