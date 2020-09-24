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
    it("Should render '#serviceFormNameInput'", () => {
      expect(wrapper.render().find("#serviceFormNameInput").length).toEqual(1);
    });
    it("Should render '#serviceFormPriceInput'", () => {
      expect(wrapper.render().find("#serviceFormPriceInput").length).toEqual(1);
    });
    it("Should render '#serviceFormDescInput'", () => {
      expect(wrapper.render().find("#serviceFormDescInput").length).toEqual(1);
    });
    it("Should render '#adminServiceFormCreate' Button", () => {
      expect(wrapper.render().find("#adminServiceFormCreate").length).toEqual(1);
    });
    it("Should NOT render '#adminServiceFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminServiceFormUpdate").length).toEqual(0);
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
    it("Should render '#serviceFormNameInput'", () => {
      expect(wrapper.render().find("#serviceFormNameInput").length).toEqual(1);
    });
    it("Should set correct data in '#serviceFormNameInput'", () => {
      const input = wrapper.render().find("#serviceFormNameInput");
      expect(input.val()).toEqual(mockData.name);
    });
    it("Should render '#serviceFormPriceInput'", () => {
      expect(wrapper.render().find("#serviceFormPriceInput").length).toEqual(1);
    });
    it("Should set correct data in '#serviceFormPriceInput'", () => {
      const input = wrapper.render().find("#serviceFormPriceInput");
      expect(input.val()).toEqual(mockData.price);
    });
    it("Should render '#serviceFormDescInput'", () => {
      expect(wrapper.render().find("#serviceFormDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#serviceFormDescInput'", () => {
      const input = wrapper.render().find("#serviceFormDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should render '#adminServiceFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminServiceFormUpdate").length).toEqual(1);
    });
    it("Should NOT render '#adminServiceFormCreate' Button", () => {
      expect(wrapper.render().find("#adminServiceFormCreate").length).toEqual(0);
    });
  });
});