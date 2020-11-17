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
    it("Should render '#adminStoreItemFormNameInput'", () => {
      expect(wrapper.render().find("#adminStoreItemFormNameInput").length).toEqual(1);
    });
    it("Should render '#adminStoreItemFormPriceInput'", () => {
      expect(wrapper.render().find("#adminStoreItemFormPriceInput").length).toEqual(1);
    });
    it("Should render '#adminStoreItemFormDescInput'", () => {
      expect(wrapper.render().find("#adminStoreItemFormDescInput").length).toEqual(1);
    });
    it("Should render '#adminStoreItemFormDetailsInput'", () => {
      expect(wrapper.render().find("#adminStoreItemFormDetailsInput").length).toEqual(1);
    });
    it("Should render '#adminStoreItemFormCreateBtn' Button", () => {
      expect(wrapper.render().find("#adminStoreItemFormCreateBtn").length).toEqual(1);
    });
    it("Should NOT render '#adminStoreItemFormUpdateBtn' Button'", () => {
      expect(wrapper.render().find("#adminStoreItemFormUpdateBtn").length).toEqual(0);
    });
  });
  
  describe("Form with valid data render tests", () => {
    let wrapper: ReactWrapper; let mockData: IStoreItemData;
    let mockStoreData: StoreItemFormStoreDropdownData[];
    const mockDate: string = new Date("1/1/2019").toString();

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
        createdAt: mockDate
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
    it("Should render '#adminStoreItemFormNameInput'", () => {
      expect(wrapper.render().find("#adminStoreItemFormNameInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminStoreItemFormNameInput'", () => {
      const input = wrapper.render().find("#adminStoreItemFormNameInput");
      expect(input.val()).toEqual(mockData.name);
    });
    it("Should render '#adminStoreItemFormPriceInput'", () => {
      expect(wrapper.render().find("#adminStoreItemFormPriceInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminStoreItemFormPriceInput'", () => {
      const input = wrapper.render().find("#adminStoreItemFormPriceInput");
      expect(input.val()).toEqual(mockData.price);
    });
    it("Should render 'adminStoreItemFormDescInput'", () => {
      expect(wrapper.render().find("#adminStoreItemFormDescInput").length).toEqual(1);
    });
    it("Should set correct data in '#adminStoreItemFormDescInput'", () => {
      const input = wrapper.render().find("#adminStoreItemFormDescInput");
      expect(input.val()).toEqual(mockData.description);
    });
    it("Should NOT render '#adminStoreItemFormCreateBtn' Button", () => {
      expect(wrapper.render().find("#adminStoreItemFormCreateBtn").length).toEqual(0);
    });
    it("Should render '#storeItemFormUpdateBtn' Button'", () => {
      expect(wrapper.render().find("#adminStoreItemFormUpdateBtn").length).toEqual(1);
    });
  });
})