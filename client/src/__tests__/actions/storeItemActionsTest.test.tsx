import React from "react";
import faker from "faker";
// test dependences //
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import moxios from "moxios";
// component dependencies //
import StoreItemView from "../../components/admin_components/store_items/StoreItemsView";
// state and React.context dependenies //
import { IGlobalAppState, IGlobalAppContext } from "../../state/Store";
import { StateProvider } from "../../state/Store";
// actions to test //
import { setCurrentStoreItem, clearCurrentStoreItem } from "../../components/admin_components/store_items/actions/UIStoreItemActions";
import { getAllStoreItems, getStoreItem, createStoreItem, editStoreItem, 
  deleteStoreItem, uploadStoreItemImage, deleteStoreItemImage 
} from "../../components/admin_components/store_items/actions/APIStoreItemActions";
// helpers and additional dependencies //
import { emptyStoreItemData } from "../../state/reducers/storeItemReducer";
import { createMockStoreItems, createMockStoreItemImage } from "../../test_helpers/store_itemHelpers"
import { ClientStoreItemData } from "../../components/admin_components/store_items/actions/APIStoreItemActions";



type WrapperProps = {
  value: IGlobalAppContext;
}

const getContextFromWrapper = (wrapper: ShallowWrapper): IGlobalAppContext => {
  const props = wrapper.props() as WrapperProps;
  const globalAppContext = props.value;
  return globalAppContext;
}

describe("StoreItem Actions Tests", () => {
  let wrapper: ShallowWrapper;
  beforeAll(() => {
    wrapper = shallow(
    <StateProvider>
      <StoreItemView></StoreItemView>
    </StateProvider>
    );
  })
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });

  describe("Action: 'SET_CURRENT_STORE_ITEM'", () => {
    let mockStoreItems: IStoreItemData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    beforeAll(() => {
      mockStoreItems = createMockStoreItems(10);
     ({ state, dispatch } = getContextFromWrapper(wrapper));
    });
    it("Should properly dispatch the action", () => {
      state.storeItemState.loadedStoreItems = [ ...mockStoreItems ];
      const store_item = state.storeItemState.loadedStoreItems[0];
      setCurrentStoreItem(store_item._id, dispatch, state);
    });
    it('Should return the correct new state', () => {
      // expected state after action //
      const expectedStoreItemState = state.storeItemState;
      expectedStoreItemState.currentStoreItemData = mockStoreItems[0];
      // retrieve new state //
      const { state : newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

  describe("Action: 'CLEAR_CURRENT_STORE_ITEM'", () => {
    let mockStoreItems: IStoreItemData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    beforeAll(() => {
      mockStoreItems = createMockStoreItems(10);
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      state.storeItemState.currentStoreItemData = mockStoreItems[0];
    });
    it("Should properly dispatch the action", () => {
      clearCurrentStoreItem(dispatch);
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedStoreItemState = state.storeItemState;
      expectedStoreItemState.currentStoreItemData = emptyStoreItemData();
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

  describe("Action: 'GET_ALL_STORE_ITEMS'", () => {
    let mockStoreItems: IStoreItemData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    beforeAll(() => {
      mockStoreItems = createMockStoreItems(10);
      ({ state, dispatch } = getContextFromWrapper(wrapper));
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            store_items: mockStoreItems
          }
        });
      });
      getAllStoreItems(dispatch)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedStoreItemState = { ...state.storeItemState };
      expectedStoreItemState.responseMsg = "All Ok";
      expectedStoreItemState.loadedStoreItems = mockStoreItems;
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

  describe("Action: 'GET_STORE_ITEM'", () => {
    let mockStoreItem: IStoreItemData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    beforeAll(() => {
      mockStoreItem = createMockStoreItems(1)[0];
      ({ state, dispatch } = getContextFromWrapper(wrapper));
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            store_item: mockStoreItem
          }
        });
      });
      // mock action with moxios //
      getStoreItem(mockStoreItem._id, dispatch)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedStoreItemState = { ...state.storeItemState };
      expectedStoreItemState.responseMsg = "All Ok";
      expectedStoreItemState.currentStoreItemData = mockStoreItem;
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

  describe("Action: 'CREATE_STORE_ITEM'", () => {
    let createdStoreItem: IStoreItemData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      createdStoreItem = createMockStoreItems(1)[0];
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            newStoreItem: createdStoreItem
          }
        });
      });
      // mock store_item form data //
      let newStoreItem: ClientStoreItemData = {
        name: createdStoreItem.name,
        description: createdStoreItem.description,
        price: "100",
        store_itemImages: createdStoreItem.images
      };
      // mock action with moxios //
      createStoreItem(newStoreItem, dispatch)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedStoreItemState = { ...state.storeItemState };
      expectedStoreItemState.responseMsg = "All Ok";
      expectedStoreItemState.currentStoreItemData = createdStoreItem;
      expectedStoreItemState.loadedStoreItems = [ ...expectedStoreItemState.loadedStoreItems, createdStoreItem ]
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

  describe("Action: 'EDIT_STORE_ITEM'", () => {
    let editedStoreItem: IStoreItemData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      let store_item = { ...state.storeItemState.loadedStoreItems[0] };
      store_item.name = faker.lorem.word();
      store_item.description = faker.lorem.paragraphs(1),
      editedStoreItem = store_item;
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            editedStoreItem: editedStoreItem
          }
        });
      });
      // mock store_item form data //
      let store_itemUpdate: ClientStoreItemData = {
        name: editedStoreItem.name,
        price: editedStoreItem.price,
        description: editedStoreItem.description,
        store_itemImages: editedStoreItem.images
      };
      // mock action with moxios //
      editStoreItem(editedStoreItem._id, store_itemUpdate, dispatch, state)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedStoreItemState = { ...state.storeItemState };
      expectedStoreItemState.responseMsg = "All Ok";
      expectedStoreItemState.currentStoreItemData = editedStoreItem;
      expectedStoreItemState.loadedStoreItems = expectedStoreItemState.loadedStoreItems.map((store_item) => {
        if (store_item._id === editedStoreItem._id) {
          return editedStoreItem;
        } else {
          return store_item;
        }
      })
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

  describe("Action: 'DELETE_STORE_ITEM'", () => {
    let deletedStoreItem: IStoreItemData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      deletedStoreItem = state.storeItemState.loadedStoreItems[0];
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            deletedStoreItem: deletedStoreItem
          }
        });
      });
      // mock action with moxios //
      deleteStoreItem(deletedStoreItem._id, dispatch, state)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedStoreItemState = { ...state.storeItemState };
      expectedStoreItemState.responseMsg = "All Ok";
      expectedStoreItemState.currentStoreItemData = emptyStoreItemData();
      expectedStoreItemState.loadedStoreItems = state.storeItemState.loadedStoreItems.filter((storeItem) => storeItem._id !== deletedStoreItem._id);
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

  describe("Action: 'UPLOAD_STORE_ITEM_IMAGE'", () => {
    let createdImage: IStoreItemImgData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    let updatedStoreItem: IStoreItemData;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      state.storeItemState.currentStoreItemData = state.storeItemState.loadedStoreItems[0];
      createdImage = createMockStoreItemImage();
      // set mock updated store_item with mock image //
      updatedStoreItem = state.storeItemState.loadedStoreItems[0];
      updatedStoreItem.images.push(createdImage);
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            updatedStoreItem: updatedStoreItem
          }
        });
      });
      // mock action with moxios //
      const formData = new FormData();
      uploadStoreItemImage(updatedStoreItem._id, formData, state, dispatch) 
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedStoreItemState = { ...state.storeItemState };
      expectedStoreItemState.responseMsg = "All Ok";
      expectedStoreItemState.currentStoreItemData = updatedStoreItem;
      expectedStoreItemState.loadedStoreItems = state.storeItemState.loadedStoreItems.map((storeItem) => {
        if (storeItem._id === updatedStoreItem._id) {
          return updatedStoreItem;
        } else {
          return storeItem;
        }
      });
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

  describe("Action: 'DELETE_STORE_ITEM_IMAGE'", () => {
    let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;
    let updatedStoreItem: IStoreItemData;

    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      updatedStoreItem = { ...state.storeItemState.currentStoreItemData, images: [] };
    });

    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            updatedStoreItem: updatedStoreItem
          }
        });
      });
      // mock action with moxios //
      deleteStoreItemImage(updatedStoreItem._id, state, dispatch) 
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
    });
    it("Should return the correct new state", () => {
      // expected state after action //
      const expectedStoreItemState = { ...state.storeItemState };
      expectedStoreItemState.responseMsg = "All Ok";
      expectedStoreItemState.currentStoreItemData = updatedStoreItem;
      expectedStoreItemState.loadedStoreItems = state.storeItemState.loadedStoreItems.map((storeItem) => {
        if (storeItem._id === updatedStoreItem._id) {
          return  {
            ...updatedStoreItem,
            images: []
          };
        } else {
          return storeItem;
        }
      });
      // retrieve new state and compare //
      const { state: newState } = getContextFromWrapper(wrapper);
      expect(newState.storeItemState).to.eql(expectedStoreItemState);
    });
    it("Should NOT have an error", () => {
      const { state } = getContextFromWrapper(wrapper);
      expect(state.storeItemState.error).to.equal(null);
    });
  });

});