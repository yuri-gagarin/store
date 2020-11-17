import React from "react";
import { Button } from "semantic-ui-react";
import moxios from "moxios";
// testing imports //
import { mount, ReactWrapper } from "enzyme";
import { act } from 'react-dom/test-utils';
// components //
import ProductImgUplForm from "../../../../components/admin_components/products/forms/ProductImgUplForm";
// React.Context and State //
import { TestStateProvider } from "../../../../state/Store";
// helpers //
import MockFile from "../../../helpers/mockFile";
import { createMockProductImage, createMockProducts } from "../../../../test_helpers/productHelpers";
import ProductImageUplForm from "../../../../components/admin_components/products/forms/ProductImgUplForm";
import { generateCleanState } from "../../../../test_helpers/miscHelpers";

describe("Product Image Upload Form Tests", () => {
  let mockProductData: IProductData;
  
  beforeAll(() => {
    mockProductData = createMockProducts(1)[0];
    mockProductData.images[0] = createMockProductImage(mockProductData._id);
  });
  
  describe("Render tests without any Image data", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      wrapper = mount(<ProductImgUplForm />)
     });

    it("Should properly render", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render one '#productImgSelectBtn' element", () => {
      const uplButton = wrapper.render().find("#productImgSelectBtn");
      expect(uplButton.length).toEqual(1);
    });
    it("Should NOT render '#productImgUploadControls", () => {
      const controls = wrapper.find("#productImgUploadControls");
      expect(controls.length).toEqual(0);
    });
    it("Should render an input", () => {
      const input = wrapper.find("input");
      expect(input.length).toEqual(1);
    });
  });
  
  describe("Render tests with an Image file present", () => {
    let wrapper: ReactWrapper;
    let input: ReactWrapper;

    beforeAll(() => {
      wrapper =  mount(<ProductImgUplForm />);
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    it("Should properly set the file in props", () => {
      expect(input.prop("type")).toBeDefined();
      expect(input.prop("type")).toEqual("file");
    });
    it("Should successfully update and render the '#productImgUploadBtn' button", () => {
      const imgUpoadBtn = wrapper.render().find("#productImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should successfully update and render the '#productImgCancelBtn' button", () => {
      const imgCanceldBtn = wrapper.render().find("#productImgCancelBtn");
      expect(imgCanceldBtn.length).toEqual(1);
    });
    it("Should NOT render the '#productImageRetryButton'", () => {
      const retryButton  = wrapper.render().find("#productImgRetryButton");
      expect(retryButton.length).toEqual(0);
    });
    it("Should properly handle the '#productImgCancelBtn' and render correct local state", () => {
      const imgCancelBtn = wrapper.find("#productImgCancelBtn");
      imgCancelBtn.at(0).simulate("click");
      expect(wrapper.render().find("#productImgCancelBtn").length).toEqual(0);
      expect(wrapper.render().find("#productImgUploadBtn").length).toEqual(0);
      expect(wrapper.render().find("#productImgRetryBtn").length).toEqual(0);
      expect(wrapper.render().find("#productImgSelectBtn").length).toEqual(1);
    });
  });
  
  // MOCK Successful Image upload tests //
  describe("'#productImgUploadBtn' functionality and successful upload with local state changes", () => {
    let component: ReactWrapper;
    let input: ReactWrapper;

    beforeAll(() => {
      const state = generateCleanState();
      state.productState.currentProductData = mockProductData;

      moxios.install();
      moxios.stubRequest(`/api/uploads/product_images/${mockProductData._id}`, {
        status: 200,
        response: {
          responseMsg: "ok",
          updatedProduct: mockProductData
        }
      });

      component = mount(
        <TestStateProvider mockState={state}>
          <ProductImgUplForm />
        </TestStateProvider>
      );
      // mock an image //
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = component.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });
    afterAll(() => {
      moxios.uninstall();
    });
    it("Should dispatch a 'correct' API request show 'loader'", async () => {
      const promise = Promise.resolve();
      const imgUpoadBtn = component.find("#productImgUploadBtn");
      imgUpoadBtn.at(0).simulate("click");
      // clear promises //
      await act( async () => promise);
      const uploadButton = component.find(ProductImageUplForm).find(Button).at(1);
      expect(uploadButton.props().loading).toEqual(true);
    });

    it("Should correctly render '#productImgSelectBtn' button after 'successful upload", () => {
      component.update();
      const selectImgBtn = component.find(ProductImgUplForm).render().find("#productImgSelectBtn");
      expect(selectImgBtn.length).toEqual(1);
    });
    it("Should NOT render '#productImgRetryButton' after 'successful upload", () => {
      const imgUpoadBtn = component.find(ProductImgUplForm).render().find("#productImgRetryButton");
      expect(imgUpoadBtn.length).toEqual(0);
    });
    it("Should NOT render '#productImgUploadBtn' button after 'successful upload", () => {
      const imgUpoadBtn = component.find(ProductImgUplForm).render().find("#productImgUploadBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
    it("Should NOT render '#productImgCancelBtn' button after 'successful upload", () => {
      const imgUpoadBtn = component.find(ProductImgUplForm).render().find("#productImgCancelBtn");
      expect(imgUpoadBtn.length).toEqual(0);
    });
  });
  // END Mock successful Image upload tests //
  // MOCK unsuccessful Image upload tests //
  
  describe("'#cancelProductImgUploadBtn' functionality and a failed upload", () => {
    let wrapper: ReactWrapper;
    let input: ReactWrapper;
    const error = new Error("An error occured");

    beforeAll(() => {
      const state = generateCleanState();
      state.productState.currentProductData = mockProductData;

      moxios.install();
      moxios.stubRequest(`/api/uploads/product_images/${mockProductData._id}`, {
        status: 500,
        response: {
          responseMsg: "Error",
          error: error
        }
      });

      wrapper = mount(
        <TestStateProvider mockState={state}>
          <ProductImgUplForm />
        </TestStateProvider>
      );
      const file: File = MockFile.create("test", 1024, { type: "image/jpeg" });
      input = wrapper.find("input");
      input.simulate("change", { target: { files: [ file ] } });
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it("Should successfully handle the '#productImgUploadBtn' API error, render 'loader'", async () => {
      const promise = Promise.resolve();
      const imgUpoadBtn = wrapper.find("#productImgUploadBtn").at(0);

      imgUpoadBtn.simulate("click");
      // loader should be displayed on the  #productImgUploadBtn //
      await act( async() => promise);
      const updatedButton = wrapper.find(ProductImageUplForm).find(Button).at(1);
      expect(updatedButton.props().loading).toEqual(true);
    });
    it("Should render '#productImgRetryButton' button after a 'failed' upload", () => {
      const imgUpoadBtn = wrapper.find(ProductImgUplForm).render().find("#productImgRetryButton");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should render '#productImgCancelBtn' button after a 'failed' upload", () => {
      const imgUpoadBtn = wrapper.find(ProductImgUplForm).render().find("#productImgCancelBtn");
      expect(imgUpoadBtn.length).toEqual(1);
    });
    it("Should NOT render '#selectProductImgBtn' button after a 'failed' upload", () => {
      const selectImgBtn = wrapper.find(ProductImgUplForm).render().find("#selectProductImgBtn");
      expect(selectImgBtn.length).toEqual(0);
    });
    
    
  });
  
  // END Mock unsuccessful Image upload tests //
});