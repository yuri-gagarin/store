import React from "react";
import StoreForm from "../../../../components/admin_components/stores/forms/StoreForm";
import { mount, ReactWrapper } from "enzyme";
// helpers //

describe("Store Form Component render tests", () => {
  describe("Empty Form render tests", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock data //
      const storeData: IStoreData = {
        _id: "",
        title: "",
        description: "",
        images: [],
        createdAt: ""
      }
      // mount form //
      wrapper = mount(
        <StoreForm  
          title={storeData.title}
          description={storeData.description}
          newForm={true}
          handleCreateStore={jest.fn}
          handleUpdateStore={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#storeFormTitleInput'", () => {
      expect(wrapper.render().find("#adminStoreFormTitleInput").length).toEqual(1);
    });
    it("Should render '#storeFormDescInput'", () => {
      expect(wrapper.render().find("#adminStoreFormDescInput").length).toEqual(1);
    });
    it("Should render '#adminStoreFormCreate' Button", () => {
      expect(wrapper.render().find("#adminStoreFormCreateBtn").length).toEqual(1);
    });
    it("Should NOT render '#adminStoreFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminStoreFormUpdateBtn").length).toEqual(0);
    });
  });
  
  describe("Form with valid data render tests", () => {
    let wrapper: ReactWrapper; let mockData: IStoreData;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock store data //
      mockData = {
        _id: "1",
        title: "title",
        description: "description",
        images: [],
        createdAt: "now"
      };

      wrapper = mount(
        <StoreForm 
          title={mockData.title}
          description={mockData.description}
          newForm={false}
          handleCreateStore={jest.fn}
          handleUpdateStore={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#adminStoreFormTitleInput'", () => {
      expect(wrapper.render().find("#adminStoreFormTitleInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminStoreFormTitleInput'", () => {
      const input = wrapper.render().find("#adminStoreFormTitleInput");
      expect(input.val()).toEqual(mockData.title);
    });
    it("Should render '#adminStoreFormDescInput'", () => {
      expect(wrapper.render().find("#adminStoreFormDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminStoreFormDescInput'", () => {
      const input = wrapper.render().find("#adminStoreFormDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should render '#adminStoreFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminStoreFormUpdateBtn").length).toEqual(1);
    });
    it("Should NOT render '#adminStoreFormCreate' Button", () => {
      expect(wrapper.render().find("#adminStoreFormCreateBtn").length).toEqual(0);
    });
  });
});