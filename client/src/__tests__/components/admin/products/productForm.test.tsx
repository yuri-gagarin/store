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
          name={productData.name}
          price={productData.price}
          description={productData.description}
          newForm={true}
          details={productData.details}
          handleCreateProduct={jest.fn}
          handleUpdateProduct={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#adminProductFormNameInput'", () => {
      expect(wrapper.render().find("#adminProductFormNameInput").length).toEqual(1);
    });
    it("Should render '#adminProductFormPriceInput'", () => {
      expect(wrapper.render().find("#adminProductFormPriceInput").length).toEqual(1);
    });
    it("Should render '#adminProductFormDescInput'", () => {
      expect(wrapper.render().find("#adminProductFormDescInput").length).toEqual(1);
    });
    it("Should render '#adminProductFormDetailsInput'", () => {
      expect(wrapper.render().find("#adminProductFormDetailsInput").length).toEqual(1);
    });
    it("Should render '#adminProductFormCreate' Button", () => {
      expect(wrapper.render().find("#adminProductFormCreate").length).toEqual(1);
    });
    it("Should NOT render '#adminProductFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminProductFormUpdate").length).toEqual(0);
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
          name={mockData.name}
          price={mockData.price}
          description={mockData.description}
          newForm={false}
          details={mockData.details}
          handleCreateProduct={jest.fn}
          handleUpdateProduct={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#adminProductFormNameInput'", () => {
      expect(wrapper.render().find("#adminProductFormNameInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminProductFormNameInput'", () => {
      const input = wrapper.render().find("#adminProductFormNameInput");
      expect(input.val()).toEqual(mockData.name);
    });
    it("Should render '#adminProductFormPriceInput'", () => {
      expect(wrapper.render().find("#adminProductFormPriceInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminProductFormPriceInput'", () => {
      const input = wrapper.render().find("#adminProductFormPriceInput");
      expect(input.val()).toEqual(mockData.price);
    });
    it("Should render '#adminProductFormDescInput'", () => {
      expect(wrapper.render().find("#adminProductFormDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminProductFormDescInput'", () => {
      const input = wrapper.render().find("#adminProductFormDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should render '#adminProductFormDetailsInput'", () => {
      expect(wrapper.render().find("#adminProductFormDetailsInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminProductFormDetailsInput'", () => {
      const input = wrapper.render().find("#adminProductFormDetailsInput");
      expect(input.val()).toEqual(mockData.details);
    });
    it("Should render '#adminProductFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminProductFormUpdate").length).toEqual(1);
    });
    it("Should NOT render '#adminProductFormCreate' Button", () => {
      expect(wrapper.render().find("#adminProductFormCreate").length).toEqual(0);
    });
  });
})