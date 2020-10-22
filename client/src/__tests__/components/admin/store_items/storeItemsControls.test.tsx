import React, { useContext } from "react";
import { Dropdown } from "semantic-ui-react";
// test dependencies
import moxios from "moxios";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
// 
import { AppAction, IGlobalAppState, Store, TestStateProvider } from "../../../../state/Store";
import StoreItemsControls from "../../../../components/admin_components/store_items/store_items_preview/StoreItemsControls";
import { createMockStoreItems } from "../../../../test_helpers/storeItemHelpers";

interface CompProps {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}



const renderWithState = <P extends {}>(Component: React.ComponentType<P & CompProps>) => {
  return (props: P) => {
    const { state , dispatch } = useContext(Store);
   
    return (
      <Component state={state} dispatch={dispatch} { ...props } />
    )
  }
  
}

describe("'StoreItemsControls' component render tests", () => {
  let mockStores: IStoreData[];
  let wrapper: ReactWrapper;
  const mockDate = new Date("1/1/2019").toString();

  beforeAll(() => {
    mockStores = [
      {
        _id: "1",
        title: "first",
        description: "description",
        images: [],
        createdAt: mockDate
      },
      {
        _id: "2",
        title: "second",
        description: "description",
        images: [],
        createdAt: mockDate
      }
    ]
  })
  beforeAll( async () => {
    const promise = Promise.resolve();
    moxios.install();
    moxios.stubRequest("/api/stores", {
      status: 200,
      response: {
        responseMsg: "Got all stores",
        stores: mockStores
      }
    })
    const Comp = renderWithState(StoreItemsControls)
    wrapper = mount(
      <TestStateProvider>
        <Comp />
      </TestStateProvider>
    );
    await act(async () => promise);
    moxios.uninstall();
  });
  // TEST default render tests //
  describe("Default render test  with empty 'storeItem' state", () => {
    it("Should properly render and match snapshot", () => {
      //console.log(renderWithS(<TestStateProvider />))
      const storeItemControls = wrapper.find(StoreItemsControls);
      expect(storeItemControls.length).toEqual(1);
      expect(storeItemControls).toMatchSnapshot();
    });
    it("The '#adminStoreItemControlsStoreDropdown' should be loading and disabled by default", () => {
      const storeNameDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(0);
      expect(storeNameDropdown.props().loading).toEqual(true);
      expect(storeNameDropdown.props().disabled).toEqual(true);
    })
    it("Should enable the '#adminStoreItemControlsDropdown' and remove 'loading' after rerender", () => {
      wrapper.update();
      const storeNameDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(0);
      expect(storeNameDropdown.props().loading).toEqual(false);
      expect(storeNameDropdown.props().disabled).toEqual(false);
    });
    it("Should render a correct number 'Dropdown.Item' components", () => {
      const storeNameDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(0);
      const storeDropdownItems = storeNameDropdown.find(Dropdown.Item);
      expect(storeDropdownItems.length).toEqual(mockStores.length);
    });
  });
  // END default render tests //
  // TEST Dropdown sort by DATE DESC render tests //
  describe("'Dropdown' '#adminStoreItemControlsDateDropdown' click 'DATE' 'DESC'", () => {
    let mockStoreItems: IStoreItemData[];

    beforeAll(() => {
      moxios.install();
      mockStoreItems = createMockStoreItems(5);
    });
    afterAll(() => {
      moxios.uninstall();
    });
    it("Should have the '#adminStoreItemDateDescQuery' 'Dropdown.Item'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(1);
      const dropdownItem = sortByDateDropdown.find("#adminStoreItemDateDescQuery").at(0);
      expect(dropdownItem.props().value).toEqual("desc");
    })
    it("Should handle 'Dropdown.Item' click and dispatch correct API request", async () => {
      const promise = Promise.resolve();
  
      moxios.stubRequest("/api/store_items?date=desc", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      });
    
      const sortByDateDesc = wrapper.find(StoreItemsControls).find("#adminStoreItemDateDescQuery");
      sortByDateDesc.at(0).simulate("click");

      await act( async () => promise)
      
      const request = (moxios.requests.mostRecent());
      expect(request.url).toEqual("/api/store_items?date=desc");
    });

    it("Should set the '#adminStoreItemControlsDateDropdown' props to 'loading'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(1);
      expect(sortByDateDropdown.props().loading).toEqual(true);
    });
    it("Should set the '#adminStoreItemControlsDateDropdown' props to 'loading == false' after rerender", () => {
      wrapper.update();
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(1);
      expect(sortByDateDropdown.props().loading).toEqual(false);
      expect(sortByDateDropdown.props().disabled).toEqual(false);
    });
  });
  // END Dropdown sort by DATE DESC render tests //
  // TEST Dropdown sort by DATE ASC render tests //
  describe("'Dropdown' '#adminStoreItemControlsDateDropdown' click 'DATE' 'ASC'", () => {
    let mockStoreItems: IStoreItemData[];

    beforeAll(() => {
      moxios.install();
      mockStoreItems = createMockStoreItems(5);
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should have the '#adminStoreItemDateAscQuery' 'Dropdown.Item'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(1);
      const dropdownItem = sortByDateDropdown.find("#adminStoreItemDateAscQuery").at(0);
      expect(dropdownItem.props().value).toEqual("asc");
    })
    it("Should handle 'Dropdown.Item' click and dispatch correct API request", async () => {
      const promise = Promise.resolve();
  
      moxios.stubRequest("/api/store_items?date=asc", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      });
    
      const sortByDateDesc = wrapper.find(StoreItemsControls).find("#adminStoreItemDateAscQuery");
      sortByDateDesc.at(0).simulate("click");

      await act( async () => promise)
      
      const request = (moxios.requests.mostRecent());
      expect(request.url).toEqual("/api/store_items?date=asc");
    });
    it("Should set the '#adminStoreItemControlsDateDropdown' props to 'loading'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(1);
      expect(sortByDateDropdown.props().loading).toEqual(true);
    });
    it("Should set the '#adminStoreItemControlsDateDropdown' props to 'loading == false' after rerender", () => {
      wrapper.update();
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(1);
      expect(sortByDateDropdown.props().loading).toEqual(false);
      expect(sortByDateDropdown.props().disabled).toEqual(false);
    });

  });
  // END Dropdown sort by DATE ASC render tests //
  // TEST Dropdown sort by PRICE DESC render tests //
  describe("'Dropdown' '#adminStoreItemControlsPriceDropdown' click 'PRICE' 'DESC'", () => {
    let mockStoreItems: IStoreItemData[];

    beforeAll(() => {
      moxios.install();
      mockStoreItems = createMockStoreItems(5);
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should have the '#adminStoreItemPriceDescQuery' 'Dropdown.Item'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(2);
      const dropdownItem = sortByDateDropdown.find("#adminStoreItemPriceDescQuery").at(0);
      expect(dropdownItem.props().value).toEqual("desc");
    });
    it("Should handle 'Dropdown.Item' click and dispatch correct API request", async () => {
      const promise = Promise.resolve();
  
      moxios.stubRequest("/api/store_items?price=desc", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      });
    
      const sortByDateDesc = wrapper.find(StoreItemsControls).find("#adminStoreItemPriceDescQuery");
      sortByDateDesc.at(0).simulate("click");

      await act( async () => promise)
      
      const request = (moxios.requests.mostRecent());
      expect(request.url).toEqual("/api/store_items?price=desc");
    });

    it("Should set the '#adminStoreItemControlsPriceDropdown' props to 'loading'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(2);
      expect(sortByDateDropdown.props().loading).toEqual(true);
    });
    it("Should set the '#adminStoreItemControlsPriceDropdown' props to 'loading == false' after rerender", () => {
      wrapper.update();
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(2);
      expect(sortByDateDropdown.props().loading).toEqual(false);
      expect(sortByDateDropdown.props().disabled).toEqual(false);
    });

  });
  // END Dropdown sort by PRICE DESC render tests //
  // TEST Dropdown sort by PRICE ASC render tests //
  describe("'Dropdown' '#adminStoreItemControlsPriceDropdown' click 'PRICE' 'ASC'", () => {
    let mockStoreItems: IStoreItemData[];

    beforeAll(() => {
      moxios.install();
      mockStoreItems = createMockStoreItems(5);
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should have the '#adminStoreItemPriceAscQuery' 'Dropdown.Item'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(2);
      const dropdownItem = sortByDateDropdown.find("#adminStoreItemPriceAscQuery").at(0);
      expect(dropdownItem.props().value).toEqual("asc");
    })
    it("Should handle 'Dropdown.Item' click and dispatch correct API request", async () => {
      const promise = Promise.resolve();
  
      moxios.stubRequest("/api/store_items?price=asc", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      });
    
      const sortByDateDesc = wrapper.find(StoreItemsControls).find("#adminStoreItemPriceAscQuery");
      sortByDateDesc.at(0).simulate("click");

      await act( async () => promise)
      
      const request = (moxios.requests.mostRecent());
      expect(request.url).toEqual("/api/store_items?price=asc");
    });

    it("Should set the '#adminStoreItemControlsPriceDropdown' props to 'loading'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(2);
      expect(sortByDateDropdown.props().loading).toEqual(true);
    });
    it("Should set the '#adminStoreItemControlsPriceDropdown' props to 'loading == false' after rerender", () => {
      wrapper.update();
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(2);
      expect(sortByDateDropdown.props().loading).toEqual(false);
      expect(sortByDateDropdown.props().disabled).toEqual(false);
    });

  });
  // END Dropdown sort by PRICE ASC render tests //
  // TEST Dropdown sort by NAME ASC render tests //
  describe("'Dropdown' '#adminStoreItemControlsNameDropdown' click 'NAME' 'ASC'", () => {
    let mockStoreItems: IStoreItemData[];

    beforeAll(() => {
      moxios.install();
      mockStoreItems = createMockStoreItems(5);
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should have the '#adminStoreItemNameAscQuery' 'Dropdown.Item'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(3);
      const dropdownItem = sortByDateDropdown.find("#adminStoreItemNameAscQuery").at(0);
      expect(dropdownItem.props().value).toEqual("asc");
    })
    it("Should handle 'Dropdown.Item' click and dispatch correct API request", async () => {
      const promise = Promise.resolve();
  
      moxios.stubRequest("/api/store_items?name=asc", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      });
    
      const sortByDateDesc = wrapper.find(StoreItemsControls).find("#adminStoreItemNameAscQuery");
      sortByDateDesc.at(0).simulate("click");

      await act( async () => promise)
      
      const request = (moxios.requests.mostRecent());
      expect(request.url).toEqual("/api/store_items?name=asc");
    });

    it("Should set the '#adminStoreItemControlsNameDropdown' props to 'loading'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(3);
      expect(sortByDateDropdown.props().loading).toEqual(true);
    });
    it("Should set the '#adminStoreItemControlsNameDropdown' props to 'loading == false' after rerender", () => {
      wrapper.update();
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(3);
      expect(sortByDateDropdown.props().loading).toEqual(false);
      expect(sortByDateDropdown.props().disabled).toEqual(false);
    });

  });
  // END Dropdown sort by NAME ASC render tests //
  // TEST Dropdown sort by NAME DESC render tests //
  describe("'Dropdown' '#adminStoreItemControlsNameDropdown' click 'NAME' 'DESC'", () => {
    let mockStoreItems: IStoreItemData[];

    beforeAll(() => {
      moxios.install();
      mockStoreItems = createMockStoreItems(5);
    });
    afterAll(() => {
      moxios.uninstall();
    });

    it("Should have the '#adminStoreItemNameDescQuery' 'Dropdown.Item'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(3);
      const dropdownItem = sortByDateDropdown.find("#adminStoreItemNameDescQuery").at(0);
      expect(dropdownItem.props().value).toEqual("desc");
    })
    it("Should handle 'Dropdown.Item' click and dispatch correct API request", async () => {
      const promise = Promise.resolve();
  
      moxios.stubRequest("/api/store_items?name=desc", {
        status: 200,
        response: {
          responseMsg: "All ok",
          storeItems: mockStoreItems
        }
      });
    
      const sortByDateDesc = wrapper.find(StoreItemsControls).find("#adminStoreItemNameDescQuery");
      sortByDateDesc.at(0).simulate("click");

      await act( async () => promise)
      
      const request = (moxios.requests.mostRecent());
      expect(request.url).toEqual("/api/store_items?name=desc");
    });

    it("Should set the '#adminStoreItemControlsNameDropdown' props to 'loading'", () => {
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(3);
      expect(sortByDateDropdown.props().loading).toEqual(true);
    });
    it("Should set the '#adminStoreItemControlsNAmeDropdown' props to 'loading == false' after rerender", () => {
      wrapper.update();
      const sortByDateDropdown = wrapper.find(StoreItemsControls).find(Dropdown).at(3);
      expect(sortByDateDropdown.props().loading).toEqual(false);
      expect(sortByDateDropdown.props().disabled).toEqual(false);
    });

  });
  
})