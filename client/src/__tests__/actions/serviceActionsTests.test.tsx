import React from "react";
import faker from "faker";
// test dependences
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import moxios from "moxios";
import { AxiosRequestConfig } from "axios";
// state and React.context dependenies //
import { IGlobalAppState, IGlobalAppContext, TestStateProvider } from "../../state/Store";
// actions to test //
import { setCurrentService, clearCurrentService, openServiceForm, closeServiceForm } from "../../components/admin_components/services/actions/UIServiceActions";
import { getAllServices, getService, createService, editService, 
  deleteService, uploadServiceImage, deleteServiceImage 
} from "../../components/admin_components/services/actions/APIServiceActions";
// helpers and additional dependencies //
import { emptyServiceData } from "../../state/reducers/serviceReducer";
import { createMockServices, createMockServiceImage, clearServiceState } from "../../test_helpers/serviceHelpers";
import { ClientServiceData } from "../../components/admin_components/services/type_definitions/serviceTypes";
import { generateCleanState } from "../../test_helpers/miscHelpers";



type WrapperProps = {
  value: IGlobalAppContext;
}

const getContextFromWrapper = (wrapper: ShallowWrapper): IGlobalAppContext => {
  const props = wrapper.props() as WrapperProps;
  const globalAppContext = props.value;
  return globalAppContext;
}

describe("Service Actions Tests", () => {
  // TEST NON API actions tests //
  describe("NON API Actions tests", () => {
    let wrapper: ShallowWrapper;
    let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;

    beforeAll(() => {
      let testState = generateCleanState();
      testState.serviceState.loadedServices = [ ...createMockServices(10) ];
      wrapper = shallow(
        <TestStateProvider mockState={testState} />
      );
    });

    describe(`Action: 'SET_CURRENT_SERVICE`, () => {

      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action and set new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.currentServiceData = { ...state.serviceState.loadedServices[0] };
        // fire off the action //
        const serviceId = state.serviceState.loadedServices[0]._id;
        setCurrentService(serviceId, dispatch, state);
        // get new state //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState.error).to.eq(null);
      });
    });

    describe("Action: 'CLEAR_CURRENT_SERVICE", () => {

      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action and set the new state", () => {
        // expected state after the action //
        const expectedState: IGlobalAppState = { ...state, serviceState: { ...state.serviceState, currentServiceData: emptyServiceData() } };
        // fire off the action //
        clearCurrentService(dispatch);
        // get new state //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an Error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.eql(null);
      });
    });

    describe("Action: 'OPEN_SERVICE_FORM'", () => {

      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action and set new state", () => {
        // expected state after the action //
        const expectedState: IGlobalAppState = { ...state, serviceState: { ...state.serviceState, serviceFormOpen: true } };
        // fire off the action //
        openServiceForm(dispatch);
        // get new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an Error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.eql(null);
      });
    });

    describe("Action: 'CLOSE_SERVICE_FORM'", () => {

      beforeAll(() => {
        ({ dispatch, state } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action and set the new state", () => {
        // expected state after the action //
        const expectedState: IGlobalAppState = { ...state, serviceState: { ...state.serviceState, serviceFormOpen: false } };
        // fire off the action //
        closeServiceForm(dispatch);
        // get new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an Error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.eql(null);
      });
    });
  });
  // END TEST actions without API requests //
  // TEST actions with API requests - NO Error returned //
  describe("Mock requests witn no API error", () => {
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

    describe("Action: 'GET_ALL_SERVICES'", () => {
      let mockServices: IServiceData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockServices = createMockServices(10);
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
              services: mockServices
            }
          });
        });
        // mock action with moxios //
        getAllServices(dispatch)
          .then(_ => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/services");
        expect(requestConfig.method).to.eq("get");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = "All Ok";
        expectedState.serviceState.loadedServices = mockServices;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });

    describe("Action: 'GET_SERVICE'", () => {
      let mockService: IServiceData; let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        mockService = createMockServices(1)[0];
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
              service: mockService
            }
          });
        });
        // mock action with moxios //
        getService(mockService._id, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/services/" + mockService._id);
        expect(requestConfig.method).to.eq("get");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = "All Ok";
        expectedState.serviceState.currentServiceData = mockService;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });

    describe("Action: 'CREATE_SERVICE'", () => {
      let createdService: IServiceData; let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        createdService = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              newService: createdService
            }
          });
        });
        // mock service form data //
        let newService: ClientServiceData = {
          name: createdService.name,
          description: createdService.description,
          price: "100",
          images: createdService.images
        };
        // mock action with moxios //
        createService(newService, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/services/create");
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct Service Data", () => {
        const sentData: ClientServiceData = JSON.parse(requestConfig.data);
        const { name, price, description, images } = sentData;
        expect(name).to.be.a("string");
        expect(price).to.be.a("string");
        expect(description).to.be.a("string");
        expect(images).to.be.an("array");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = "All Ok";
        expectedState.serviceState.currentServiceData = createdService;
        expectedState.serviceState.loadedServices = [ ...expectedState.serviceState.loadedServices, createdService ]
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });

    describe("Action: 'EDIT_SERVICE'", () => {
      let editedService: IServiceData; let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        editedService = { ...state.serviceState.loadedServices[0] };
        editedService.name = faker.lorem.word();
        editedService.description = faker.lorem.paragraphs(1);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              editedService: editedService
            }
          });
        });
        // mock service form data //
        let serviceUpdate: ClientServiceData = {
          name: editedService.name,
          price: editedService.price,
          description: editedService.description,
          images: editedService.images
        };
        // mock action with moxios //
        editService(editedService._id, serviceUpdate, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/services/update/" + editedService._id);
        expect(requestConfig.method).to.eq("patch");
      });
      it("Should send the correct Service Data", () => {
        const sentData: ClientServiceData = JSON.parse(requestConfig.data);
        const { name, price, description, images } = sentData;
        expect(name).to.be.a("string");
        expect(price).to.be.a("string");
        expect(description).to.be.a("string");
        expect(images).to.be.an("array");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = "All Ok";
        expectedState.serviceState.currentServiceData = editedService;
        expectedState.serviceState.loadedServices = expectedState.serviceState.loadedServices.map((service) => {
          if (service._id === editedService._id) {
            return editedService;
          } else {
            return service;
          }
        });
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });

    describe("Action: 'DELETE_SERVICE'", () => {
      let deletedService: IServiceData; let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedService = { ...state.serviceState.loadedServices[0] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              deletedService: deletedService
            }
          });
        });
        // mock action with moxios //
        deleteService(deletedService._id, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/services/delete/" + deletedService._id);
        expect(requestConfig.method).to.eq("delete");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = "All Ok";
        expectedState.serviceState.currentServiceData = emptyServiceData();
        expectedState.serviceState.loadedServices = state.serviceState.loadedServices.filter((service) => service._id !== deletedService._id);
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });

    describe("Action: 'UPLOAD_SERVICE_IMAGE'", () => {
      let createdImage: IServiceImgData; let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      let updatedService: IServiceData; let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        state.serviceState.currentServiceData = state.serviceState.loadedServices[0];
        createdImage = createMockServiceImage();
        // set mock updated service with mock image //
        updatedService = { ...state.serviceState.loadedServices[0] };
        updatedService.images.push(createdImage);
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              updatedService: updatedService
            }
          });
        });
        // mock action with moxios //
        const formData = new FormData();
        uploadServiceImage(updatedService._id, formData, state, dispatch) 
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/service_images/" + updatedService._id);
        expect(requestConfig.method).to.eq("post");
      });
      it("Should send the correct request Data", () => {
        expect(requestConfig.data instanceof FormData).to.eq(true);
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = "All Ok";
        expectedState.serviceState.currentServiceData = updatedService;
        expectedState.serviceState.loadedServices = state.serviceState.loadedServices.map((service) => {
          if (service._id === updatedService._id) {
            return updatedService;
          } else {
            return service;
          }
        });
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });

    describe("Action: 'DELETE_SERVICE_IMAGE'", () => {
      let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      let updatedService: IServiceData; let deletedImage: IServiceImgData;
      let requestConfig: AxiosRequestConfig;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        deletedImage = { ...state.serviceState.currentServiceData.images[0] };
        updatedService = { ...state.serviceState.currentServiceData, images: [] };
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.respondWith({
            status: 200,
            response: {
              responseMsg: "All Ok",
              updatedService: updatedService
            }
          });
        });
        // mock action with moxios //
        deleteServiceImage(deletedImage._id, state, dispatch) 
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/uploads/service_images/" + deletedImage._id + "/" + updatedService._id);
        expect(requestConfig.method).to.eq("delete");
      });
      it("Should not send any additional data", () => {
        expect(requestConfig.data).to.eq(undefined);
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = "All Ok";
        expectedState.serviceState.currentServiceData = updatedService;
        expectedState.serviceState.loadedServices = state.serviceState.loadedServices.map((service) => {
          if (service._id === updatedService._id) {
            return  {
              ...updatedService,
              images: []
            };
          } else {
            return service;
          }
        });
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });
  });
  // END TEST actions with  API requests - NO Error returned //
  // TEST actions with API requests - Error returned //
  describe("Mock request with API error returned", () => {
    let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
    let wrapper: ShallowWrapper;
    const error = new Error("Error occured");

    beforeAll(() => {
      wrapper = shallow(
        <TestStateProvider />
      );
    });
    beforeEach(() => {
      moxios.install();
      clearServiceState(state);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'GET_ALL_SERVICES'", () => {

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error);
        });
        getAllServices(dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = error.message;
        expectedState.serviceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'GET_SERVICE'", () => {
      let service: IServiceData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        getService(service._id, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = error.message;
        expectedState.serviceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'CREATE_SERVICE'", () => {
      let service: IServiceData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        createService(service, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = error.message;
        expectedState.serviceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'EDIT_SERVICE'", () => {
      let service: IServiceData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        editService(service._id, service, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = error.message;
        expectedState.serviceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_SERVICE'", () => {
      let service: IServiceData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteService(service._id, dispatch, state)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = error.message;
        expectedState.serviceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'UPLOAD_SERVICE_IMAGE'", () => {
      let service: IServiceData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        const mockImg = new FormData();
        uploadServiceImage(service._id, mockImg, state, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = error.message;
        expectedState.serviceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_SERVICE_IMAGE'", () => {
      let serviceImage: IServiceImgData;

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        serviceImage = createMockServiceImage(faker.random.alphaNumeric(10));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.reject(error)
        });
        deleteServiceImage(serviceImage._id, state, dispatch)
          .then((_) => {
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedState: IGlobalAppState = { ...state };
        expectedState.serviceState.responseMsg = error.message;
        expectedState.serviceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState).to.eql(expectedState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

  });
  // END TEST actions with API requests - Error returned //

});