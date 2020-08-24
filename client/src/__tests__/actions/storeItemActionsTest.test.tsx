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
import { createMockStoreItems, createMockStoreItemImage, clearStoreItemState } from "../../test_helpers/storeItemHelpers"
import { ClientStoreItemData } from "../../components/admin_components/store_items/actions/APIStoreItemActions";
import { AxiosRequestConfig } from "axios";



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
  });

  describe("Mock requests with no errors", () => {
    
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
      state.storeItemState.error = null;
      });

      it("Should properly dispatch the action", () => {
        state.storeItemState.loadedStoreItems = [ ...mockStoreItems ];
        const storeItem = state.storeItemState.loadedStoreItems[0];
        setCurrentStoreItem(storeItem._id, dispatch, state);
      });
      it('Should return the correct new state', () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
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
        const expectedStoreItemState = { ...state.storeItemState };
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockStoreItems = createMockStoreItems(10);
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              storeItems: mockStoreItems
            }
          });
        });
        // mock action with moxios //
        getAllStoreItems(dispatch)
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/store_items");
        expect(requestConfig.method).to.eq("get");
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockStoreItem = createMockStoreItems(1)[0];
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              storeItem: mockStoreItem
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
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/store_items/" + mockStoreItem._id);
        expect(requestConfig.method).to.eq("get");
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        createdStoreItem = createMockStoreItems(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
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
          ...createdStoreItem,
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
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/store_items/create");
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct Store Item Data", () => {
        const sentData: ClientStoreItemData = JSON.parse(requestConfig.data);
        const { storeId, storeName, name, price, description, details, images, categories } = sentData;
        expect(storeId).to.be.a("string");
        expect(storeName).to.be.a("string");
        expect(name).to.be.a("string");
        expect(price).to.be.a("string");
        expect(description).to.be.a("string");
        expect(details).to.be.a("string");
        expect(images).to.be.an("array");
        expect(categories).to.be.an("array");
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        editedStoreItem = { ...state.storeItemState.loadedStoreItems[0] };
        editedStoreItem.name = faker.lorem.word();
        editedStoreItem.description = faker.lorem.paragraphs(1);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              editedStoreItem: editedStoreItem
            }
          });
        });
        // mock storeItem form data //
        let storeItemUpdate: ClientStoreItemData = {
          ...editedStoreItem,
        };
        // mock action with moxios //
        editStoreItem(editedStoreItem._id, storeItemUpdate, dispatch, state)
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/store_items/update/" + editedStoreItem._id);
        expect(requestConfig.method).to.eq("patch");
      });
      it("Should send the correct Store Item Data", () => {
        const sentData: ClientStoreItemData = JSON.parse(requestConfig.data);
        const { storeId, storeName, name, price, description, details, images, categories } = sentData;
        expect(storeId).to.be.a("string");
        expect(storeName).to.be.a("string");
        expect(name).to.be.a("string");
        expect(price).to.be.a("string");
        expect(description).to.be.a("string");
        expect(details).to.be.a("string");
        expect(images).to.be.an("array");
        expect(categories).to.be.an("array");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
        expectedStoreItemState.responseMsg = "All Ok";
        expectedStoreItemState.currentStoreItemData = editedStoreItem;
        expectedStoreItemState.loadedStoreItems = expectedStoreItemState.loadedStoreItems.map((storeItem) => {
          if (storeItem._id === editedStoreItem._id) {
            return editedStoreItem;
          } else {
            return storeItem;
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
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedStoreItem = { ...state.storeItemState.loadedStoreItems[0] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config
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
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/store_items/delete/" + deletedStoreItem._id);
        expect(requestConfig.method).to.eq("delete");
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
      let updatedStoreItem: IStoreItemData; let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        state.storeItemState.currentStoreItemData = state.storeItemState.loadedStoreItems[0];
        createdImage = createMockStoreItemImage();
        // set mock updated store_item with mock image //
        updatedStoreItem = { ...state.storeItemState.currentStoreItemData };
        updatedStoreItem.images.push(createdImage);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
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
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/store_item_images/" + updatedStoreItem._id);
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct request Data", () => {
        expect(requestConfig.data instanceof FormData).to.eq(true);
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
      let updatedStoreItem: IStoreItemData; let deletedImage: IStoreItemImgData;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedImage = { ...state.storeItemState.currentStoreItemData.images[0] }
        updatedStoreItem = { ...state.storeItemState.currentStoreItemData, images: [] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              updatedStoreItem: updatedStoreItem
            }
          });
        });
        // mock action with moxios //
        deleteStoreItemImage(deletedImage._id, state, dispatch) 
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/store_item_images/" + deletedImage._id + "/" + updatedStoreItem._id);
        expect(requestConfig.method).to.eq("delete");
      });
      it("Should not send any additional data", () => {
        expect(requestConfig.data).to.eq(undefined);
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

  describe("Mock request with API error returned", () => {
    let state: IGlobalAppState; let dispatch: React.Dispatch<StoreItemAction>;

    beforeEach(() => {
      moxios.install();
      clearStoreItemState(state);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'GET_ALL_STORE_ITEMS'", () => {
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        getAllStoreItems(dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
        expectedStoreItemState.responseMsg = error.message;
        expectedStoreItemState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.storeItemState).to.eql(expectedStoreItemState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeItemState.error).to.not.be.null;
      });
    });

    describe("Action: 'GET_STORE_ITEM'", () => {
      let storeItem: IStoreItemData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        storeItem = createMockStoreItems(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        getStoreItem(storeItem._id, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
        expectedStoreItemState.responseMsg = error.message;
        expectedStoreItemState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.storeItemState).to.eql(expectedStoreItemState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeItemState.error).to.not.be.null;
      });
    });

    describe("Action: 'CREATE_STORE_ITEM'", () => {
      let storeItem: IStoreItemData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        storeItem = createMockStoreItems(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        createStoreItem(storeItem, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
        expectedStoreItemState.responseMsg = error.message;
        expectedStoreItemState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.storeItemState).to.eql(expectedStoreItemState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeItemState.error).to.not.be.null;
      });
    });

    describe("Action: 'EDIT_STORE_ITEM'", () => {
      let storeItem: IStoreItemData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        storeItem = createMockStoreItems(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        editStoreItem(storeItem._id, storeItem, dispatch, state)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
        expectedStoreItemState.responseMsg = error.message;
        expectedStoreItemState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.storeItemState).to.eql(expectedStoreItemState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeItemState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_STORE_ITEM'", () => {
      let storeItem: IStoreItemData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        storeItem = createMockStoreItems(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteStoreItem(storeItem._id, dispatch, state)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
        expectedStoreItemState.responseMsg = error.message;
        expectedStoreItemState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.storeItemState).to.eql(expectedStoreItemState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeItemState.error).to.not.be.null;
      });
    });

    describe("Action: 'UPLOAD_STORE_ITEM_IMAGE'", () => {
      let storeItem: IStoreItemData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        storeItem = createMockStoreItems(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        const mockImg = new FormData();
        uploadStoreItemImage(storeItem._id, mockImg, state, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
        expectedStoreItemState.responseMsg = error.message;
        expectedStoreItemState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.storeItemState).to.eql(expectedStoreItemState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeItemState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_STORE_ITEM_IMAGE'", () => {
      let storeItemImage: IStoreItemImgData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        storeItemImage = createMockStoreItemImage(faker.random.alphaNumeric(10));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteStoreItemImage(storeItemImage._id, state, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedStoreItemState = { ...state.storeItemState };
        expectedStoreItemState.responseMsg = error.message;
        expectedStoreItemState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.storeItemState).to.eql(expectedStoreItemState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeItemState.error).to.not.be.null;
      });
    });

  });
});