import React from "react";
import ProductForm from "../../../../components/admin_components/products/forms/ProductForm";
import { mount, ReactWrapper } from "enzyme";
// helpers //

describe("PRoduct Form Component render tests", () => {
  describe("Empty Form render tests", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock data //
      const productData: IProductData = {
        _id: "",
        name: "",
        price: "",
        description: "",
        details: "",
        images: [],
        createdAt: ""
      }
      // mount form //
      wrapper = mount(
        <ProductForm  
          productData={productData} 
          handleCreateProduct={jest.fn}
          handleUpdateProduct={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#productFormNameInput'", () => {
      expect(wrapper.render().find("#productFormNameInput").length).toEqual(1);
    });
    it("Should render '#productFormPriceInput'", () => {
      expect(wrapper.render().find("#productFormPriceInput").length).toEqual(1);
    });
    it("Should render '#productFormDescInput'", () => {
      expect(wrapper.render().find("#productFormDescInput").length).toEqual(1);
    });
    it("Should render '#productFormDetailsInput'", () => {
      expect(wrapper.render().find("#productFormDetailsInput").length).toEqual(1);
    });
    it("Should render '#productFormCreate' Button", () => {
      expect(wrapper.render().find("#productFormCreate").length).toEqual(1);
    });
    it("Should NOT render '#productFormUpdate' Button'", () => {
      expect(wrapper.render().find("#productFormUpdate").length).toEqual(0);
    });
  });
  
  describe("Form with valid data render tests", () => {
    let wrapper: ReactWrapper; let mockData: IProductData;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock product data //
      mockData = {
        _id: "1",
        name: "name",
        price: "100",
        description: "description",
        details: "details",
        images: [],
        createdAt: "now"
      };

      wrapper = mount(
        <ProductForm 
          productData={mockData}
          handleCreatePRoduct={jest.fn}
          handleUpdatePRoduct={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#productFormNameInput'", () => {
      expect(wrapper.render().find("#productFormNameInput").length).toEqual(1);
    });
    it("Should set correct data in '#productFormNameInput'", () => {
      const input = wrapper.render().find("#productFormNameInput");
      expect(input.val()).toEqual(mockData.name);
    });
    it("Should render '#productFormPriceInput'", () => {
      expect(wrapper.render().find("#productFormPriceInput").length).toEqual(1);
    });
    it("Should set correct data in '#productFormPriceInput'", () => {
      const input = wrapper.render().find("#productFormPriceInput");
      expect(input.val()).toEqual(mockData.price);
    });
    it("Should render '#productFormDescInput'", () => {
      expect(wrapper.render().find("#productFormDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#productFormDescInput'", () => {
      const input = wrapper.render().find("#productFormDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should render '#productFormDetailsInput'", () => {
      expect(wrapper.render().find("#productFormDetailsInput").length).toEqual(1);
    });
    it("Should set correct data in '#productFormDetailsInput'", () => {
      const input = wrapper.render().find("#productFormDetailsInput");
      expect(input.val()).toEqual(mockData.details);
    });
    it("Should render '#productFormUpdate' Button'", () => {
      expect(wrapper.render().find("#productFormUpdate").length).toEqual(1);
    });
    it("Should NOT render '#productFormCreate' Button", () => {
      expect(wrapper.render().find("#productFormCreate").length).toEqual(0);
    });
  });
})