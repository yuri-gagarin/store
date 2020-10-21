import React, { useEffect, useState } from "react";
import { Button, Dropdown, DropdownProps } from "semantic-ui-react";
import ReactDOM from "react-dom";
import { mount, shallow, ReactWrapper } from "enzyme";
import { useContext } from "react";
import { AppAction, IGlobalAppContext, IGlobalAppState, Store, TestStateProvider } from "../../../../state/Store";
import getContextFromWrapper from "../../../helpers/getContextFromWrapper";
import StoreItemsControls from "../../../../components/admin_components/store_items/store_items_preview/StoreItemsControls";
import moxios from "moxios";
import { act } from "react-dom/test-utils";

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
  });
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
    })
  })
  /*
  describe("'StoreItem' sort click 'DATE' 'DESC'", () => {
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    })
    it("Should handle 'Dropdown.Item' click and dispatch correct API request", async () => {
      const promise = Promise.resolve();

      await moxios.wait( async () => {
        const request = moxios.requests.mostRecent();
        console.log(request);
        console.log(45)
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "ok",
            storeItems: []
          }
        })

        const sortByDateDesc = wrapper.find(StoreItemsControls).find("#adminStoreItemDateDescQuery");
        sortByDateDesc.at(0).simulate("click");
  
        
        await act( async () => promise);
      })
      
     
    })
  })
  */
})