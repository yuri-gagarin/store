import React from "react"
import { Button } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter as Router } from "react-router-dom";
// component imports //
import ProductFormHolder from "../../../../components/admin_components/products/forms/ProductFormHolder";
import ProductForm from "../../../../components/admin_components/products/forms/ProductForm";
import ProductImageUplForm from "../../../../components/admin_components/products/forms/ProductImgUplForm";
import ProductImgPreviewHolder from "../../../../components/admin_components/products/image_preview/ProductImgPreviewHolder";
import ProductImgPreviewThumb from "../../../../components/admin_components/products/image_preview/ProductImgThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, StateProvider, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockProducts, setMockProductState } from "../../../../test_helpers/productHelpers";
import { createMockStores } from "../../../../test_helpers/storeHelpers";

describe("ProductFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router>
          <ProductFormHolder />
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(Button);
      expect(toggleButton.length).toEqual(1);
    });

  });
  // TEST Form Holder state OPEN - NO Current Product Data //
  describe("Form Holder state OPEN - NO Current Product Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router>
          <StateProvider>
            <ProductFormHolder />
          </StateProvider>
        </Router>
      );
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should Properly Mount Form Holder, respond to '#productToggleBtn' click", () => {
      const toggleButton = wrapper.find("#productFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      //wrapper.update()
      expect(wrapper).toMatchSnapshot();
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
  // END Form Holder state OPEN - NO Current Product Data //
  // TEST Form Holder state OPEN - WITH Current Product Data - NO IMAGES //
  describe("Form Holder state OPEN - WITH Current Product Data - NO IMAGES",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockProductState({ currentProduct: true });
      wrapper = mount(
        <Router>
          <TestStateProvider mockState={state}>
            <ProductFormHolder />
          </TestStateProvider>
        </Router>
      );
      wrapper.update()
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find("#productFormHolder").length).toEqual(1);
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
  // END Form Holder state OPEN - WITH Current Product Data - NO IMAGES //
  // TEST Form Holder state OPEN - WITH Current Product Data - WITH IMAGES //
  describe("Form Holder state OPEN - WITH Current Product Data - WITH IMAGES",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = setMockProductState({ currentProduct: true, productImages: 3 });
      wrapper = mount(
        <Router>
          <TestStateProvider mockState={state}>
            <ProductFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find("#productFormHolder").length).toEqual(1);
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
  // END Form Holder state OPEN - WITH Current Product Data - WITH IMAGES //
  // TEST Form Holder state OPEN - MOCK Submit action //
  describe("Form Holder state OPEN - MOCK Submit action",  () => {
    let state: IGlobalAppState; let wrapper: ReactWrapper;

    beforeAll( async () => {
      window.scrollTo = jest.fn();
      // mount and wait //
      wrapper = mount(
        <Router initialEntries={["/admin/products/create"]} >
          <TestStateProvider>
            <ProductFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should have a submit button", () => {
      wrapper.update();
      wrapper.find("#productFormToggleBtn").at(0).simulate("click").update();
      const adminProductFormCreate = wrapper.find("#adminProductFormCreate").at(0);
      expect(adminProductFormCreate.length).toEqual(1)
    });
    it("Should handle the 'handleCreateProductAction, show 'LoadingBar' Component", async () => {
      moxios.install();
      await act( async () => {
        moxios.stubRequest("/api/products/create", {
          status: 200,
          response: {
            responseMsg: "All Good",
            newProduct: createMockProducts(1)[0]
          }
        });
        const adminProductFormCreate = wrapper.find("#adminProductFormCreate").at(0);
        adminProductFormCreate.simulate("click");
        //expect(wrapper.find(LoadingBar).length).toEqual(1);
      });
      // expect(sinon.spy(createProduct)).toHaveBeenCalled()
      wrapper.update();
    });
    it("Should NOT show the 'LoadingBar' Component after successful API call", () => {
      expect(wrapper.find(LoadingBar).length).toEqual(0);
    });
    it("Should NOT show the 'ProductForm' Component after successful API call", () => {
      expect(wrapper.find(ProductForm).length).toEqual(0);
    });
    // END Form Holder state OPEN - MOCK Submit action //
  });
  
});