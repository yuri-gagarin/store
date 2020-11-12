import React from "react";
import ServiceForm from "../../../../components/admin_components/services/forms/ServiceForm";
import { mount, ReactWrapper } from "enzyme";
// helpers //

describe("Service Form Component render tests", () => {
  describe("Empty Form render tests", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock data //
      const serviceData: IServiceData = {
        _id: "",
        name: "",
        price: "",
        description: "",
        images: [],
        createdAt: ""
      }
      // mount form //
      wrapper = mount(
        <ServiceForm  
          name={serviceData.name}
          price={serviceData.price}
          description={serviceData.description}
          newForm={true}
          handleCreateService={jest.fn}
          handleUpdateService={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#adminServiceFormNameInput'", () => {
      expect(wrapper.render().find("#adminServiceFormNameInput").length).toEqual(1);
    });
    it("Should render '#serviceFormPriceInput'", () => {
      expect(wrapper.render().find("#adminServiceFormPriceInput").length).toEqual(1);
    });
    it("Should render '#serviceFormDescInput'", () => {
      expect(wrapper.render().find("#adminServiceFormDescInput").length).toEqual(1);
    });
    it("Should render '#adminServiceFormCreate' Button", () => {
      expect(wrapper.render().find("#adminServiceFormCreateBtn").length).toEqual(1);
    });
    it("Should NOT render '#adminServiceFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminServiceFormUpdateBtn").length).toEqual(0);
    });
  });
  
  describe("Form with valid data render tests", () => {
    let wrapper: ReactWrapper; let mockData: IServiceData;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock service data //
      mockData = {
        _id: "1",
        name: "name",
        price: "100",
        description: "description",
        images: [],
        createdAt: "now"
      };

      wrapper = mount(
        <ServiceForm 
          name={mockData.name}
          price={mockData.price}
          description={mockData.description}
          newForm={false}
          handleCreateService={jest.fn}
          handleUpdateService={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#adminServiceFormNameInput'", () => {
      expect(wrapper.render().find("#adminServiceFormNameInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminServiceFormNameInput'", () => {
      const input = wrapper.render().find("#adminServiceFormNameInput");
      expect(input.val()).toEqual(mockData.name);
    });
    it("Should render '#adminServiceFormPriceInput'", () => {
      expect(wrapper.render().find("#adminServiceFormPriceInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminServiceFormPriceInput'", () => {
      const input = wrapper.render().find("#adminServiceFormPriceInput");
      expect(input.val()).toEqual(mockData.price);
    });
    it("Should render '#adminServiceFormDescInput'", () => {
      expect(wrapper.render().find("#adminServiceFormDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminServiceFormDescInput'", () => {
      const input = wrapper.render().find("#adminServiceFormDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should render '#adminServiceFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminServiceFormUpdateBtn").length).toEqual(1);
    });
    it("Should NOT render '#adminServiceFormCreate' Button", () => {
      expect(wrapper.render().find("#adminServiceFormCreateBtn").length).toEqual(0);
    });
  });
});