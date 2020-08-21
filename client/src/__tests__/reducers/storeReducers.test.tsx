import React, { useContext } from "react";
import { expect } from "chai";
import moxios from "moxios";
import configureStore from "redux-mock-store";
import storeReducer, { initialStoreState } from "../../state/reducers/storeReducer";
import { createMockStores } from "../helpers/storeHelpers";
import { initialContext, IGlobalAppState, AppAction } from "../../state/Store";
import { setCurrentStore } from "../../components/admin_components/stores/actions/uiStoreActions";
import { StateProvider } from "../../state/Store";
import { mount, shallow } from "enzyme";
import StoreView from "../../components/admin_components/stores/StoreView";

const mockStore = configureStore<IGlobalAppState, StoreAction>();
const store = mockStore(initialContext.state);

describe("Store Reducers tests", () => {

  beforeAll(() => {
    const wrapper = shallow(
    <StateProvider>
      <StoreView></StoreView>
    </StateProvider>
    );
    console.log(wrapper.props())
  })
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  })
  describe("Default return value test", () => {
    it("Should return the default state", () => {
      expect(storeReducer(initialStoreState, {} as StoreAction)).to.deep.equal(initialStoreState);
    })
  });
  describe("Get All Stores Action", () => {
    /*
    it("Should set a store array in 'StoreState'", () => {
      const stores = createMockStores(5);
      const payload = {
        loading: false,
        responseMsg: "All ok",
        loadedStores: stores,
        error: null
      }
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All ok",
            stores: stores
          }
        });
      });

      const result = storeReducer(initialStoreState, { type: "GET_ALL_STORES", payload: payload })
    });
    */
   it("Should something", () => {
     const mockStoreData = createMockStores(2)[0];
     setCurrentStore("idhere", store.dispatch, store.getState())

     store.dispatch({ 
       type: "SET_CURRENT_STORE", 
       payload: { currentStoreData: mockStoreData }
     })
     store.dispatch({
       type: ""
     })
     console.log(store.getState().storeState);
   });
  });
})