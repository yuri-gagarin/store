import React from "react"
import { Button } from "semantic-ui-react";
// testing utils
import { mount, ReactWrapper } from "enzyme";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
// client routing //
import { MemoryRouter, Router } from "react-router-dom";
// component imports //
import ProductFormContainer from "../../../../components/admin_components/products/forms/ProductFormContainer";
import ProductForm from "../../../../components/admin_components/products/forms/ProductForm";
import ProductImageUplForm from "../../../../components/admin_components/products/forms/ProductImgUplForm";
import ProductImgPreviewContainer from "../../../../components/admin_components/products/image_preview/ProductImgPreviewContainer";
import ProductImgPreviewThumb from "../../../../components/admin_components/products/image_preview/ProductImgThumb";
import LoadingBar from "../../../../components/admin_components/miscelaneous/LoadingBar";
// state React.Context //
import { IGlobalAppState, TestStateProvider } from "../../../../state/Store";
// helpers //
import { createMockProducts, setMockProductState } from "../../../../test_helpers/productHelpers";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";
import { AdminProductRoutes } from "../../../../routes/adminRoutes";
import StoreForm from "../../../../components/admin_components/stores/forms/StoreForm";
import ErrorBar from "../../../../components/admin_components/miscelaneous/ErrorBar";

describe("'ProductFormContainer' Component tests", () => {
  let wrapper: ReactWrapper; 
  let mockProduct: IProductData;
  
  describe("Default 'ProductFormContainer' state",  () => {

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <ProductFormContainer />
        </MemoryRouter>
      );
    });

    it("Should properly mount the component", () => {
      expect(wrapper.find(ProductFormContainer)).toMatchSnapshot();
    });
    it("Form Should be closed by default", () => {
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(0);
    });
    it("Should have a Form toggle Button", () => {
      const toggleButton = wrapper.find(ProductFormContainer).render().find("#productFormToggleBtn");
      expect(toggleButton.length).toEqual(1);
    });

  });
  
  // TEST Form Container state OPEN - NO Current Product Data //
  describe("Form Container state OPEN - NO Current Product Data",  () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn();
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider>
            <ProductFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
    });
    it("Should render a Form toggle Button", () => {
      const toggleButton = wrapper.find(ProductFormContainer).render().find('#productFormToggleBtn');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should Properly Mount Form Container, respond to '#productToggleBtn' click", () => {
      const toggleButton = wrapper.find("#productFormToggleBtn");
      toggleButton.at(0).simulate("click")
      // open button clicked //
      //wrapper.update()
      expect(wrapper.find(ProductFormContainer)).toMatchSnapshot();
    });
  
    it("Should have a Form Create Button", () => {
      const toggleButton = wrapper.find(ProductFormContainer).render().find('#adminProductFormCreate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should have the Form rendered after toggle button", () => {
      const form = wrapper.find(ProductForm);
      expect(form.length).toEqual(1);
    });
    it("Should NOT render '#productFormContainerDetails", () => {
      const details = wrapper.find(ProductFormContainer).find("#productFormContainerDetails");
      expect(details.length).toEqual(0);
    })
    it("Should NOT have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(ProductImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(0);
    });
    it("Should NOT have the Image Upload Form rendered", () => {
      const imgUploadForm = wrapper.find(ProductImageUplForm);
      expect(imgUploadForm.length).toEqual(0);
    });
  });
  // END Form Container state OPEN - NO Current Product Data //
  // TEST Form Container state OPEN - WITH Current Product Data - NO IMAGES //
  describe("Form Container state OPEN - WITH Current Product Data - NO IMAGES",  () => {
    let wrapper: ReactWrapper; let state: IGlobalAppState;

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
        <MemoryRouter keyLength={0}>
          <TestStateProvider mockState={state}>
            <ProductFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
      wrapper.update();
    });

    it("Should Properly render Form Container", () => {
      const formContainer = wrapper.find(ProductFormContainer).find("#productFormContainer");
      expect(formContainer.length).toEqual(1);
    });
    it("Should render a Form toggle Button", () => {
      const toggleButton = wrapper.find(ProductFormContainer).render().find('#productFormToggleBtn');
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
      const toggleButton = wrapper.find(ProductFormContainer).render().find('#adminProductFormUpdate');
      expect(toggleButton.length).toEqual(1);
    });
    it("Should render '#productFormContainerDetails", () => {
      const details = wrapper.find(ProductFormContainer).render().find("#productFormContainerDetails");
      expect(details.length).toEqual(1);
    });
    it("Should render correct values in '#productFormContainerDetails", () => {
      const detailsContainers = wrapper.find(ProductFormContainer).find(".productFormContainerDetailsItem");
      expect(detailsContainers.at(0).find("p").render().text()).toEqual(mockProduct.name);
      expect(detailsContainers.at(1).find("p").render().text()).toEqual(mockProduct.price);
      expect(detailsContainers.at(2).find("p").render().text()).toEqual(mockProduct.description);
      expect(detailsContainers.at(3).find("p").render().text()).toEqual(mockProduct.details);
    })
    it("Should have the Image Preview rendered", () => {
      const imgPreviewContainer = wrapper.find(ProductImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(1);
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
  // END Form Container state OPEN - WITH Current Product Data - NO IMAGES //
  // TEST Form Container state OPEN - WITH Current Product Data - WITH IMAGES //
  describe("Form Container state OPEN - WITH Current Product Data - WITH IMAGES",  () => {
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
          }
        ],
        createdAt: "1111"
      };
      state.productState.currentProductData = mockProduct;
      // mount component //
      wrapper = mount(
        <MemoryRouter keyLength={0}>
          <TestStateProvider mockState={state}>
            <ProductFormContainer />
          </TestStateProvider>
        </MemoryRouter>
      );
    });

    it("Should Properly render FormContainer", () => {
      const formContainer = wrapper.find(ProductFormContainer).find("#productFormContainer");
      expect(formContainer.length).toEqual(1);
    });
    it("Should render a Form toggle Button", () => {
      const toggleButton = wrapper.find(ProductFormContainer).render().find('#productFormToggleBtn');
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
    it("Should redner 'ProductImgPreview Container'", () => {
      const imgPreviewContainer = wrapper.find(ProductImgPreviewContainer);
      expect(imgPreviewContainer.length).toEqual(1);
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
  // END Form Container state OPEN - WITH Current Product Data - WITH IMAGES //
  // TEST Form Container state OPEN - MOCK Submit action SUCCESS //
  describe("'ProductFormContainer' - New Form - MOCK Submit action", () => {
    let mockProductData: IProductData;
    const mockDate = new Date("1/1/2019").toString();

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock store data //
      mockProductData = {
        _id: "1",
        name: "name",
        price: "100",
        description: "description",
        details: "details",
        images: [],
        createdAt: mockDate
      }

    });
    
    describe("Form Container state OPEN - New Form - MOCK Submit action SUCCESS",  () => {
      let wrapper: ReactWrapper;
      
      beforeAll( async () => {
        window.scrollTo = jest.fn();
        // mock store data //
       
        // mount and wait //
        wrapper = mount(
          <MemoryRouter keyLength={0} initialEntries={[ AdminProductRoutes.CREATE_ROUTE ]} >
            <TestStateProvider>
              <ProductFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
      });
      afterAll(() => {
        moxios.uninstall();
      });
  
      it("Should have 'ProductForm' a submit button", () => {
        wrapper.update();
        wrapper.find("#productFormToggleBtn").at(0).simulate("click").update();
        // set mock values //
        const productNameInput = wrapper.find(ProductForm).find("#adminProductFormNameInput");
        const productPriceInput = wrapper.find(ProductForm).find("#adminProductFormPriceInput");
        const productDescInput = wrapper.find(ProductForm).find("#adminProductFormDescInput");
        const productDetailsInput = wrapper.find(ProductForm).find("#adminProductFormDetailsInput");
        // simulate input //
        productNameInput.simulate("change", { target: { value: mockProductData.name } });
        productPriceInput.simulate("change", { target: { value: mockProductData.price } });
        productDescInput.at(0).simulate("change", { target: { value: mockProductData.description } });
        productDetailsInput.at(0).simulate("change", { target: { value: mockProductData.details } });
        // assert correct rendering
        const adminProductFormCreate = wrapper.find("#adminProductFormCreate").at(0);
        expect(adminProductFormCreate.length).toEqual(1)
      });
      it("Should handle the 'handleCreateProductAction, show 'LoadingBar' Component", async () => {
        const promise = Promise.resolve();
  
        moxios.install();
        moxios.stubRequest("/api/products/create", {
          status: 200,
          response: {
            responseMsg: "All Good",
            newProduct: mockProductData
          }
        });
  
        const adminProductFormCreate = wrapper.find("#adminProductFormCreate").at(0);
        adminProductFormCreate.simulate("click");
  
        await act( async () => promise);
  
        expect(wrapper.find(ProductFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(ProductFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT show the 'LoadingBar', 'ErrorBar' Components after successful API call", () => {
        wrapper.update();
        expect(wrapper.find(ProductFormContainer).find(LoadingBar).length).toEqual(0);
        expect(wrapper.find(ProductFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT show the 'ProductForm' Component after successful API call", () => {
        expect(wrapper.find(ProductForm).length).toEqual(0);
      });
      it("Should correctly render '#productFormContainerDetails' 'Grid' item", () => {
        const details = wrapper.find(ProductFormContainer).render().find("#productFormContainerDetails");
        expect(details.length).toEqual(1);
      });
      it("Should render correct values in '#productFormContainerDetails", () => {
        const detailsContainers = wrapper.find(ProductFormContainer).find(".productFormContainerDetailsItem");
        expect(detailsContainers.at(0).find("p").render().text()).toEqual(mockProductData.name);
        expect(detailsContainers.at(1).find("p").render().text()).toEqual(mockProductData.price);
        expect(detailsContainers.at(2).find("p").render().text()).toEqual(mockProductData.description);
        expect(detailsContainers.at(3).find("p").render().text()).toEqual(mockProductData.details);
      });
    });
    // END Form Container state OPEN - MOCK Submit action SUCCESS //
    // TEST ProductFormContainer component StoreForm open - MOCK Submit Error //
    describe("'ProductFormContainer' state OPEN - New Form - Mock Submit action API ERROR", () => {
      let wrapper: ReactWrapper;
      const error = new Error("An error occured");

      beforeAll( async () => {
        window.scrollTo = jest.fn();
        // mock store data //
       
        // mount and wait //
        wrapper = mount(
          <MemoryRouter keyLength={0} initialEntries={[ AdminProductRoutes.CREATE_ROUTE ]} >
            <TestStateProvider>
              <ProductFormContainer />
            </TestStateProvider>
          </MemoryRouter>
        );
      });
      afterAll(() => {
        moxios.uninstall();
      })

      it("Should have 'ProductForm' a submit button", () => {
        wrapper.update();
        wrapper.find("#productFormToggleBtn").at(0).simulate("click").update();
        // set mock values //
        const productNameInput = wrapper.find(ProductForm).find("#adminProductFormNameInput");
        const productPriceInput = wrapper.find(ProductForm).find("#adminProductFormPriceInput");
        const productDescInput = wrapper.find(ProductForm).find("#adminProductFormDescInput");
        const productDetailsInput = wrapper.find(ProductForm).find("#adminProductFormDetailsInput");
        // simulate input //
        productNameInput.simulate("change", { target: { value: mockProductData.name } });
        productPriceInput.simulate("change", { target: { value: mockProductData.price } });
        productDescInput.at(1).simulate("change", { target: { value: mockProductData.description } });
        productDetailsInput.at(1).simulate("change", { target: { value: mockProductData.details } });
        // assert correct rendering
        const adminProductFormCreate = wrapper.find("#adminProductFormCreate").at(0);
        expect(adminProductFormCreate.length).toEqual(1)
      });
      it("Should handle the 'handleCreateProductAction, show 'LoadingBar' Component", async () => {
        const promise = Promise.resolve();
  
        moxios.install();
        moxios.stubRequest("/api/products/create", {
          status: 500,
          response: {
            responseMsg: "An Error",
            error: error
          }
        });
  
        const adminProductFormCreate = wrapper.find("#adminProductFormCreate").at(0);
        adminProductFormCreate.simulate("click");
  
        await act( async () => promise);
  
        expect(wrapper.find(ProductFormContainer).find(LoadingBar).length).toEqual(1);
        expect(wrapper.find(ProductFormContainer).find(ErrorBar).length).toEqual(0);
      });
      it("Should NOT render the 'LoadingBar', but render 'ErrorBar' Components after ERROR in API call", () => {
        wrapper.update();
        expect(wrapper.find(ProductFormContainer).find(LoadingBar).length).toEqual(0);
        expect(wrapper.find(ProductFormContainer).find(ErrorBar).length).toEqual(1);
      });
      it("Should NOT close the 'ProductForm' component after a failed CREATE action", () => {
        const productForm = wrapper.find(ProductFormContainer).find(ProductForm);
        expect(productForm.length).toEqual(1)
      });
      it("Should not reset 'ProductForm' input values", () => {
        const productNameInput = wrapper.find(ProductForm).find("#adminProductFormNameInput");
        const productPriceInput = wrapper.find(ProductForm).find("#adminProductFormPriceInput");
        const productDescInput = wrapper.find(ProductForm).find("#adminProductFormDescInput").at(0);
        const productDetailsInput = wrapper.find(ProductForm).find("#adminProductFormDetailsInput").at(0);
        // assert matching values //
        expect(productNameInput.props().value).toEqual(mockProductData.name);
        expect(productPriceInput.props().value).toEqual(mockProductData.price);
        expect(productDescInput.props().value).toEqual(mockProductData.description);
        expect(productDetailsInput.props().value).toEqual(mockProductData.details);
      });
    });

  });
  
});