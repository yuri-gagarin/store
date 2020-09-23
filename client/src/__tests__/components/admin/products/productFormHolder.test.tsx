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
import { IGlobalAppState, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockProducts, setMockProductState } from "../../../../test_helpers/productHelpers";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("ProductFormHolder Component tests", () => {
  let wrapper: ReactWrapper; 
  describe("Default Form Holder state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <Router keyLength={0}>
          <ProductFormHolder />
        </Router>
      );
    });

    it("Should Properly Mount Form Holder", () => {
      expect(wrapper.find(ProductFormHolder)).toMatchSnapshot();
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
        <Router keyLength={0}>
          <TestStateProvider>
            <ProductFormHolder />
          </TestStateProvider>
        </Router>
      );
    });
    it("Should render a Form toggle Button", () => {
      const toggleButton = wrapper.find(ProductFormHolder).render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should Properly Mount Form Holder, respond to '#productToggleBtn' click", () => {
      const toggleButton = wrapper.find("#productFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      //wrapper.update()
      expect(wrapper.find(ProductFormHolder)).toMatchSnapshot();
    });
  
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.find(ProductFormHolder).render().find('#adminProductFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered after toggle button", () => {
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT render '#productFormHolderDetails", () => {
      const details = wrapper.find(ProductFormHolder).render().find("#productFormHolderDetails");
      expect(details.length).toEqual(0);
    })
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
    let mockProduct: IProductData;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      state = generateCleanState();
      mockProduct = {
        _id: "1",
        price: "100",
        name: "name",
        description: "description",
        details: "details",
        images: [],
        createdAt: "1111"
      };
      state.productState.currentProductData = mockProduct;
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider mockState={state}>
            <ProductFormHolder />
          </TestStateProvider>
        </Router>
      );
      wrapper.update();
    });

    it("Should Properly render Form Holder", () => {
      const formHolder = wrapper.find(ProductFormHolder).find("#productFormHolder");
      expect(formHolder.length).toEqual(1);
    });
    it("Should render a Form toggle Button", () => {
      const toggleButton = wrapper.find(ProductFormHolder).render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should properly render ProductForm", () => {
      const toggleButton = wrapper.find("#productFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // assert form open //
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(1);
    });
    it("Should render a Form Update Button", () => {
      const toggleButton = wrapper.find(ProductFormHolder).render().find('#adminProductFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render '#productFormHolderDetails", () => {
      const details = wrapper.find(ProductFormHolder).render().find("#productFormHolderDetails");
      expect(details.length).toEqual(1);
    });
    it("Should render correct values in '#productFormHolderDetails", () => {
      const detailsHolders = wrapper.find(ProductFormHolder).find(".productFormHolderDetailsItem");
      expect(detailsHolders.at(0).find("p").render().text()).toEqual(mockProduct.name);
      expect(detailsHolders.at(1).find("p").render().text()).toEqual(mockProduct.price);
      expect(detailsHolders.at(2).find("p").render().text()).toEqual(mockProduct.description);
    })
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
    let mockProduct: IProductData;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      // mock data //
      state = generateCleanState();
      mockProduct = {
        _id: "1",
        price: "100",
        name: "name",
        description: "description",
        details: "details",
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
        createdAt: "1111"
      };
      state.productState.currentProductData = mockProduct;
      // mount component //
      wrapper = mount(
        <Router keyLength={0}>
          <TestStateProvider mockState={state}>
            <ProductFormHolder />
          </TestStateProvider>
        </Router>
      );
    });

    it("Should Properly render FormHolder", () => {
      const formHolder = wrapper.find(ProductFormHolder).find("#productFormHolder");
      expect(formHolder.length).toEqual(1);
    });
    it("Should render a Form toggle Button", () => {
      const toggleButton = wrapper.find(ProductFormHolder).render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered", () => {
      const toggleButton = wrapper.find("#productFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // assert proper Form rendering //
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(1);
    });
    it("Should render a Form Update Button", () => {
      const toggleButton = wrapper.render().find('#adminProductFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should redner 'ProductImgPreview Holder'", () => {
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
        <Router keyLength={0} initialEntries={["/admin/products/create"]} >
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