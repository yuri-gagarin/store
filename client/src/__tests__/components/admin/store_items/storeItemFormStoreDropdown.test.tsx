import React from "react";
import { mount, ReactWrapper } from "enzyme";
// component imports //
import StoreItemFormStoreDropdown from "../../../../components/admin_components/store_items/forms/StoreItemFormStoreDropdown";
import { Dropdown } from "semantic-ui-react";
import { StoreDropdownData } from "../../../../components/admin_components/store_items/type_definitions/storeItemTypes";

describe("'StoreItemFormStoreDropdown' component render tests", () => {

  describe("'StoreItemFormStoreDropdown' component in default local state", () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
      wrapper = mount(
        <StoreItemFormStoreDropdown activeStores={[]} setStoreItemStore={jest.fn}/>
      )
    });

    it("Should properly render without errors", () => {
      expect(wrapper.find(Dropdown)).toMatchSnapshot();
    });
    it("'Dropdown' component should be disabled by default", () => {
      const dropdown = wrapper.find(Dropdown);
      expect(dropdown.props().disabled).toEqual(true);
    });
  });
  
  describe("'StoreItemFormStoreDropdown' component render tests with {activeStores} 'prop' passed in", () => {
    let wrapper: ReactWrapper; 
    let mockStores: StoreDropdownData[]

    beforeAll(() => {
      mockStores = [
        { storeId: "1", storeName: "first" },
        { storeId: "2", storeName: "second" },
        { storeId: "3", storeName: "third" }
      ];
      // mount and pass props //
      wrapper = mount(
        <StoreItemFormStoreDropdown 
          activeStores={mockStores} 
          setStoreItemStore={jest.fn}
        />
      );
    });

    it("Should properly render without errors", () => {
      expect(wrapper.find(Dropdown)).toMatchSnapshot();
    });
    it("'Dropdown' component should be NOT be disabled", () => {
      const dropdown = wrapper.find(Dropdown);
      expect(dropdown.props().disabled).toEqual(false);
    });
    it("Should render a correct number of 'Dropdown' child components", () => {
      const dropdownItems = wrapper.find(Dropdown.Item);
      expect(dropdownItems.length).toEqual(mockStores.length);
    });
  });
  
});