import React from "react";
// test dependences
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import moxios from "moxios";
import { AxiosRequestConfig } from "axios";
import faker from "faker";
// state and React.context dependenies //
import { IGlobalAppState, IGlobalAppContext, TestStateProvider } from "../../state/Store";
// actions to test //
import { setCurrentStore, clearCurrentStore, openStoreForm, closeStoreForm } from "../../components/admin_components/stores/actions/uiStoreActions";
import { getAllStores, getStore, createStore, editStore, 
  deleteStore, uploadStoreImage, deleteStoreImage 
} from "../../components/admin_components/stores/actions/APIstoreActions";
// helpers and additional dependencies //
import { emptyStoreData } from "../../state/reducers/storeReducer";
import { createMockStores, createMockStoreImage, clearStoreState } from "../../test_helpers/storeHelpers";
import { ClientStoreData } from "../../components/admin_components/stores/type_definitions/storeTypes";
import { generateCleanState } from "../../test_helpers/miscHelpers";



type WrapperProps = {
  value: IGlobalAppContext;
}

const getContextFromWrapper = (wrapper: ShallowWrapper): IGlobalAppContext => {
  const props = wrapper.props() as WrapperProps;
  const globalAppContext = props.value;
  return globalAppContext;
}

describe("Store Actions Tests", () => {
  
  describe("Non API Actions tests", () => {
    let wrapper: ShallowWrapper;
    let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;

    beforeAll(() => {
      let testState = generateCleanState();
      testState.storeState.loadedStores = [ ...createMockStores(5) ];
      wrapper = shallow(
        <TestStateProvider mockState={testState} />
      );
    });

    describe("Action: 'DISPATCH_STORE_API_REQUEST'", () => {
      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action and set new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.loading = true;
        // fire off the action //
        dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
        // get new state //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should clear a previous error if an error is present", () => {
        const { state } = getContextFromWrapper(wrapper);
        state.storeState.error = new Error("ooops");
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState, loading: true, error: null }};
        // fire off the action //
        dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
        // get new state //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
    })

    describe("Action: 'SET_CURRENT_STORE'", () => {

      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action and set new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.currentStoreData = { ...state.storeState.loadedStores[0] };
        // fire off the action //
        const storeId = state.storeState.loadedStores[0]._id;
        setCurrentStore(storeId, dispatch, state);
        // get new state //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.storeState.error).to.eq(null);
      });
    });

    describe("Action: 'CLEAR_CURRENT_STORE'", () => {

      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action and set the new state", () => {
        // expected state after the action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState, currentStoreData: emptyStoreData() } };
        // fire off the action //
        clearCurrentStore(dispatch);
        // get new state //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an Error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.eql(null);
      });
    });

    describe("Action: 'OPEN_STORE_FORM'", () => {
      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });
      it("Should properly dispatch the action and set new state", () => {
        // expected state after the action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState, storeFormOpen: true } };
        // fire off the action //
        openStoreForm(dispatch);
        // get new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an Error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.eql(null);
      });
    });

    describe("Action: 'CLOSE_STORE_FORM'", () => {

      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action and set the new state", () => {
        // expected state after the action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState, storeFormOpen: false } };
        // fire off the action //
        closeStoreForm(dispatch);
        // get new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an Error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.eql(null);
      });
    });
  });
  // END TEST actions without API requests //
  // TEST actions with API requests - NO Error returned //
  describe("Mock requests with no API error", () => {
    let wrapper: ShallowWrapper;
  
    beforeAll(() => {
      wrapper = shallow(
        <TestStateProvider />
      );
    });
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'GET_ALL_STORES'", () => {
      let mockStores: IStoreData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockStores = createMockStores(10);
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
              stores: mockStores
            }
          });
        });
        // mock action with moxios //
        getAllStores(dispatch)
          .then(() => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/stores");
        expect(requestConfig.method).to.eq("get");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = "All Ok";
        expectedState.storeState.loadedStores = mockStores;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.equal(null);
      });
    });

    describe("Action: 'GET_STORE'", () => {
      let mockStore: IStoreData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;
      let requestConfig:  AxiosRequestConfig;

      beforeAll(() => {
        mockStore = createMockStores(1)[0];
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
              store: mockStore
            }
          });
        });
        // mock action with moxios //
        getStore(mockStore._id, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/stores/" + mockStore._id);
        expect(requestConfig.method).to.eq("get");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = "All Ok";
        expectedState.storeState.currentStoreData = mockStore;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.equal(null);
      });
    });

    describe("Action: 'CREATE_STORE'", () => {
      let createdStore: IStoreData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        createdStore = createMockStores(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              newStore: createdStore
            }
          });
        });
        // mock store form data //
        let newStore = {
          title: createdStore.title,
          description: createdStore.description,
          images: createdStore.images
        };
        // mock action with moxios //
        createStore(newStore, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/stores/create");
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct Store Data", () => {
        const sentData: ClientStoreData = JSON.parse(requestConfig.data);
        const { title, description, images } = sentData;
        expect(title).to.be.a("string");
        expect(description).to.be.a("string");
        expect(images).to.be.an("array");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = "All Ok";
        expectedState.storeState.currentStoreData = createdStore;
        expectedState.storeState.loadedStores = [ ...expectedState.storeState.loadedStores, createdStore ]
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.equal(null);
      });
    });

    describe("Action: 'EDIT_STORE'", () => {
      let editedStore: IStoreData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        let store = { ...state.storeState.loadedStores[0] };
        store.title = faker.lorem.word();
        store.description = faker.lorem.paragraphs(1),
        editedStore = store;
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              editedStore: editedStore
            }
          });
        });
        // mock store form data //
        let storeUpdate = {
          title: editedStore.title,
          description: editedStore.description,
          images: editedStore.images
        };
        // mock action with moxios //
        editStore(editedStore._id, storeUpdate, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/stores/update/" + editedStore._id);
        expect(requestConfig.method).to.eq("patch");
      });
      it("Should send the correct Store Data", () => {
        const sentData: ClientStoreData = JSON.parse(requestConfig.data);
        const { title, description, images } = sentData;
        expect(title).to.be.a("string");
        expect(description).to.be.a("string");
        expect(images).to.be.an("array");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = "All Ok";
        expectedState.storeState.currentStoreData = editedStore;
        expectedState.storeState.loadedStores = expectedState.storeState.loadedStores.map((store) => {
          if (store._id === editedStore._id) {
            return editedStore;
          } else {
            return store;
          }
        })
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.equal(null);
      });
    });

    describe("Action: 'DELETE_STORE'", () => {
      let deletedStore: IStoreData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedStore = state.storeState.loadedStores[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              deletedStore: deletedStore
            }
          });
        });
        // mock action with moxios //
        deleteStore(deletedStore._id, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/stores/delete/" + deletedStore._id);
        expect(requestConfig.method).to.eq("delete");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = "All Ok";
        expectedState.storeState.currentStoreData = emptyStoreData();
        expectedState.storeState.loadedStores = state.storeState.loadedStores.filter((store) => store._id !== deletedStore._id);
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.equal(null);
      });
    });

    describe("Action: 'UPLOAD_STORE_IMAGE'", () => {
      let createdImage: IStoreImgData; let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;
      let updatedStore: IStoreData; let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        state.storeState.currentStoreData = state.storeState.loadedStores[0];
        createdImage = createMockStoreImage();
        // set mock updated store with mock image //
        updatedStore = { ...state.storeState.loadedStores[0] };
        updatedStore.images.push(createdImage);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              updatedStore: updatedStore
            }
          });
        });
        // mock action with moxios //
        const formData = new FormData();
        uploadStoreImage(updatedStore._id, formData, state, dispatch) 
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/store_images/" + updatedStore._id);
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct request Data", () => {
        expect(requestConfig.data instanceof FormData).to.eq(true);
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = "All Ok";
        expectedState.storeState.currentStoreData = updatedStore;
        expectedState.storeState.loadedStores = state.storeState.loadedStores.map((store) => {
          if (store._id === updatedStore._id) {
            return updatedStore;
          } else {
            return store;
          }
        });
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.equal(null);
      });
    });

    describe("Action: 'DELETE_STORE_IMAGE'", () => {
      let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;
      let updatedStore: IStoreData; let deletedImage: IStoreImgData;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedImage = { ...state.storeState.currentStoreData.images[0] }
        updatedStore = { ...state.storeState.currentStoreData, images: [] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              updatedStore: updatedStore
            }
          });
        });
        // mock action with moxios //
        deleteStoreImage(deletedImage._id, state, dispatch) 
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/store_images/" + deletedImage._id + "/" + updatedStore._id);
        expect(requestConfig.method).to.eq("delete");
      });
      it("Should not send any additional data", () => {
        expect(requestConfig.data).to.eq(undefined);
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = "All Ok";
        expectedState.storeState.currentStoreData = updatedStore;
        expectedState.storeState.loadedStores = state.storeState.loadedStores.map((store) => {
          if (store._id === updatedStore._id) {
            return  {
              ...updatedStore,
              images: []
            };
          } else {
            return store;
          }
        });
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.equal(null);
      });
    });
  });
  // END TEST actions with API requests - NO Error returned //
  // TEST actions with API requests - Error returned //
  describe("Mock request with API error returned", () => {
    let state: IGlobalAppState; let dispatch: React.Dispatch<StoreAction>;
    let wrapper: ShallowWrapper;
    const error = new Error("Error occured");

    beforeAll(() => {
      wrapper = shallow(
        <TestStateProvider />
      );
    });
    beforeEach(() => {
      moxios.install();
      clearStoreState(state);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'GET_ALL_STORES'", () => {

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        getAllStores(dispatch)
          .then(() => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = error.message;
        expectedState.storeState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.not.be.null;
      });
    });

    describe("Action: 'GET_STORE'", () => {
      let store: IStoreData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        store = createMockStores(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        getStore(store._id, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = error.message;
        expectedState.storeState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.not.be.null;
      });
    });

    describe("Action: 'CREATE_STORE'", () => {
      let store: IStoreData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        store = createMockStores(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        createStore(store, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = error.message;
        expectedState.storeState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.not.be.null;
      });
    });

    describe("Action: 'EDIT_STORE'", () => {
      let store: IStoreData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        store = createMockStores(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        editStore(store._id, store, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = error.message;
        expectedState.storeState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_STORE'", () => {
      let store: IStoreData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        store = createMockStores(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteStore(store._id, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = error.message;
        expectedState.storeState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.not.be.null;
      });
    });

    describe("Action: 'UPLOAD_STORE_IMAGE'", () => {
      let store: IStoreData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        store = createMockStores(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error);
        });
        const mockImg = new FormData();
        uploadStoreImage(store._id, mockImg, state, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = error.message;
        expectedState.storeState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_STORE_IMAGE'", () => {
      let storeImage: IStoreImgData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        storeImage = createMockStoreImage(faker.random.alphaNumeric(10));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteStoreImage(storeImage._id, state, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state, storeState: { ...state.storeState } };
        expectedState.storeState.responseMsg = error.message;
        expectedState.storeState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.storeState.error).to.not.be.null;
      });
    });

  });
  // END TEST actions with API requests - Error returned //

});