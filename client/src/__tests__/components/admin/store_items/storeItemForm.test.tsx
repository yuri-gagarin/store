import React from "react";
import StoreItemForm from "../../../../components/admin_components/store_items/forms/StoreItemForm";
import { mount, ReactWrapper } from "enzyme";
import { StoreItemFormStoreDropdownData, StoreDropdownData } from "../../../../components/admin_components/store_items/type_definitions/storeItemTypes";
import { Dropdown } from "semantic-ui-react";
// helpers //

describe("StoreItem Form Component render tests", () => {
  let mockStoreDropdownData: StoreDropdownData[];

  beforeAll(() => {
    mockStoreDropdownData = [
      {
        storeId: "1111",
        storeName: "first"
      },
      {
        storeId: "2222",
        storeName: "second"
      },
      {
        storeId: "3333",
        storeName: "third"
      }
    ];
  });

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
          storeId={""}
          storeName={""}
          activeStores={mockStoreDropdownData}
          name={storeItemData.name}
          price={storeItemData.price}
          details={storeItemData.details}
          description={storeItemData.description}
          categories={[]}
          newForm={true}
          handleCreateStoreItem={jest.fn}
          handleUpdateStoreItem={jest.fn}
        />
      );
    });

    it("Should properly mount", () => {
      expect(wrapper).toMatchSnapshot();
    });
    it("Should properly respond to a change in 'StoreItemFormStoreDropdown' component", () => {
      const dropdown = wrapper.find(Dropdown);
      const firstStoreSelect = dropdown.find(Dropdown.Item).first();
      firstStoreSelect.simulate("click")
    })
    it("Should render '#storeItemFormNameInput'", () => {
      expect(wrapper.render().find("#storeItemFormNameInput").length).toEqual(1);
    });
    it("Should render '#storeItemFormPriceInput'", () => {
      expect(wrapper.render().find("#storeItemFormPriceInput").length).toEqual(1);
    });
    it("Should render '#storeItemFormDescInput'", () => {
      expect(wrapper.render().find("#storeItemFormDescInput").length).toEqual(1);
    });
    it("Should render '#storeItemFormDetailsInput'", () => {
      expect(wrapper.render().find("#storeItemFormDetailsInput").length).toEqual(1);
    });
    it("Should render '#adminStoreItemFormCreate' Button", () => {
      expect(wrapper.render().find("#adminStoreItemFormCreate").length).toEqual(1);
    });
    it("Should NOT render '#adminStoreItemFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminStoreItemFormUpdate").length).toEqual(0);
    });
  });
  
  describe("Form with valid data render tests", () => {
    let wrapper: ReactWrapper; let mockData: IStoreItemData;
    let mockStoreData: StoreItemFormStoreDropdownData[];

    beforeAll(() => {
      window.scrollTo = jest.fn;
      // mock StoreItem data //
      mockData = {
        _id: "1111",
        storeName: "store1",
        storeId: "1",
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
          storeName={mockData.storeName}
          storeId={mockData.storeId}
          activeStores={[]}
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
    it("Should render '#storeItemFormNameInput'", () => {
      expect(wrapper.render().find("#storeItemFormNameInput").length).toEqual(1);
    });
    it("Should set correct data in '#storeItemFormNameInput'", () => {
      const input = wrapper.render().find("#storeItemFormNameInput");
      expect(input.val()).toEqual(mockData.name);
    });
    it("Should render '#storeItemFormPriceInput'", () => {
      expect(wrapper.render().find("#storeItemFormPriceInput").length).toEqual(1);
    });
    it("Should set correct data in '#storeItemFormPriceInput'", () => {
      const input = wrapper.render().find("#storeItemFormPriceInput");
      expect(input.val()).toEqual(mockData.price);
    });
    it("Should render '#storeItemFormDescInput'", () => {
      expect(wrapper.render().find("#storeItemFormDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#storeItemFormDescInput'", () => {
      const input = wrapper.render().find("#storeItemFormDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should NOT render '#adminStoreItemFormCreate' Button", () => {
      expect(wrapper.render().find("#adminStoreItemFormCreate").length).toEqual(0);
    });
    it("Should render '#storeItemFormUpdate' Button'", () => {
      expect(wrapper.render().find("#adminStoreItemFormUpdate").length).toEqual(1);
    });
  });
})