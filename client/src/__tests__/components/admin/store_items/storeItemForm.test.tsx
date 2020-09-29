import React from "react";
import StoreItemForm from "../../../../components/admin_components/store_items/forms/StoreItemForm";
import { mount, ReactWrapper } from "enzyme";
// helpers //

describe("StoreItem Form Component render tests", () => {
  describe("Empty Form render tests", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock data //
      const storeItemData: IStoreItemData = {
        _id: "",
        storeId: "",
        storeName: "",
        price: "",
        name: "",
        details: "",
        description: "",
        images: [],
        categories: [],
        createdAt: ""
      }
      // mount form //
      wrapper = mount(
        <StoreItemForm  
          name={storeItemData.name}
          price={storeItemData.price}
          details={storeItemData.details}
          description={storeItemData.description}
          newForm={true}
          handleCreateStoreItem={jest.fn}
          handleUpdateStoreItem={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#storeItemNameInput'", () => {
      expect(wrapper.render().find("#storeItemNameInput").length).toEqual(1);
    });
    it("Should render '#storeItemPriceInput'", () => {
      expect(wrapper.render().find("#storeItemPriceInput").length).toEqual(1);
    });
    it("Should render '#storeItemDescInput'", () => {
      expect(wrapper.render().find("#storeItemDescInput").length).toEqual(1);
    });
    it("Should render '#storeItemDetailsInput'", () => {
      expect(wrapper.render().find("#storeItemDetailsInput").length).toEqual(1);
    });
    it("Should render '#storeItemFormCreate' Button", () => {
      expect(wrapper.render().find("#storeItemFormCreate").length).toEqual(1);
    });
    it("Should NOT render '#storeItemFormUpdate' Button'", () => {
      expect(wrapper.render().find("#storeItemFormUpdate").length).toEqual(0);
    });
  });
  
  describe("Form with valid data render tests", () => {
    let wrapper: ReactWrapper; let mockData: IStoreItemData;

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock StoreItem data //
      mockData = {
        _id: "1111",
        storeName: "store",
        storeId: "2222",
        name: "name",
        price: "100",
        details: "details",
        description: "description",
        categories: [],
        images: [],
        createdAt: "now"
      };

      wrapper = mount(
        <StoreItemForm 
          name={mockData.name}
          price={mockData.price}
          description={mockData.description}
          details={mockData.details}
          categories={mockData.categories}
          newForm={false}
          handleCreateStoreItem={jest.fn}
          handleUpdateStoreItem={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should render '#storeItemName'", () => {
      expect(wrapper.render().find("#storeItemName").length).toEqual(1);
    });
    it("Should set correct data in '#storeItemName'", () => {
      const input = wrapper.render().find("#storeItemName");
      expect(input.val()).toEqual(mockData.name);
    });
    it("Should render '#storeItemPrice'", () => {
      expect(wrapper.render().find("#storeItemPrice").length).toEqual(1);
    });
    it("Should set correct data in '#storeItemPrice'", () => {
      const input = wrapper.render().find("#storeItemPrice");
      expect(input.val()).toEqual(mockData.price);
    });
    it("Should render '#storeItemDescInput'", () => {
      expect(wrapper.render().find("#storeItemDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#storeItemDescInput'", () => {
      const input = wrapper.render().find("#storeItemDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should NOT render '#storeItemFormCreate' Button", () => {
      expect(wrapper.render().find("#storeItemFormCreate").length).toEqual(0);
    });
    it("Should NOT render '#storeItemFormUpdate' Button'", () => {
      expect(wrapper.render().find("#storeItemFormUpdate").length).toEqual(1);
    });
  });
})