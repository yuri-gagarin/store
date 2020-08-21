import React, { useContext } from "react";
import { expect } from "chai";
import moxios from "moxios";
import configureStore from "redux-mock-store";
import storeReducer, { initialStoreState } from "../../state/reducers/storeReducer";
import { createMockStores } from "../helpers/storeHelpers";
import { initialContext, IGlobalAppState, AppAction, IGlobalAppContext } from "../../state/Store";
import { setCurrentStore } from "../../components/admin_components/stores/actions/uiStoreActions";
import { StateProvider } from "../../state/Store";
import { mount, shallow, ShallowWrapper } from "enzyme";
import StoreView from "../../components/admin_components/stores/StoreView";

const mockStore = configureStore<IGlobalAppState, StoreAction>();
const store = mockStore(initialContext.state);

type WrapperProps = {
  value?: IGlobalAppContext;
}
const getNewState = (wrapper: ShallowWrapper): IGlobalAppState => {
  const props = wrapper.props() as WrapperProps;
  const state = props.value!.state;
  return state;
};

const dispatchAction = (wrapper: ShallowWrapper, action: StoreAction) => {
  const props = wrapper.props() as WrapperProps;
  const dispatch = props.value!.dispatch;
  dispatch(action);
};

describe("Store Reducers tests", () => {
  let wrapper: ShallowWrapper;
  beforeAll(() => {
    wrapper = shallow(
    <StateProvider>
      <StoreView></StoreView>
    </StateProvider>
    );
    /*
    wrapper.props().value.dispatch({ type: "SET_CURRENT_STORE", payload: {
      currentStoreData: createMockStores(1)[0]
    }});
    */
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
  describe("Action: 'SET_CURRENT_STORE'", () => {
    let mockStore: IStoreData;
    beforeAll(() => {
      mockStore = createMockStores(1)[0];
    })
    it("Should properly dispatch the action", () => {
      dispatchAction(wrapper, { 
        type: "SET_CURRENT_STORE",
        payload: { currentStoreData: mockStore }
      });
    });
    it("Should correctly set the new Store State", () => {
      const expectedStoreState: IStoreState = {
        responseMsg: "",
        loading: false,
        currentStoreData: mockStore,
        loadedStores: [],
        error: null
      };
      const newStoreState = getNewState(wrapper).storeState;
      expect(expectedStoreState).to.eql(newStoreState)
    });
  });
  describe("Action: 'GET_ALL_STORES'", () => {
    let mockStores: IStoreData[];
    beforeAll(() => {
      mockStores = createMockStores(10);
    })
    it("Should properly dispatch the action", () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All ok",
            stores: mockStores
          }
        });
      });
      dispatchAction(wrapper, { 
        type: "GET_ALL_STORES",
        payload: { 
          loading: false,
          responseMsg: "All ok",
          loadedStores: mockStores,
          error: null
        }
      });
    });
    it("Should correctly set the new Store State", () => {
      const expectedStoreState: IStoreState = {
        responseMsg: "",
        loading: false,
        currentStoreData: mockStores[0],
        loadedStores: mockStores,
        error: null
      };
      const newStoreState = getNewState(wrapper).storeState;
      expect(expectedStoreState).to.eql(newStoreState)
    })
  })
})