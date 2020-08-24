import React from "react";
import faker from "faker";
// test dependences
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import moxios from "moxios";
// component dependencies //
import ServiceView from "../../components/admin_components/services/ServiceView";
// state and React.context dependenies //
import { IGlobalAppState, IGlobalAppContext } from "../../state/Store";
import { StateProvider } from "../../state/Store";
// actions to test //
import { setCurrentService, clearCurrentService } from "../../components/admin_components/services/actions/UIServiceActions";
import { getAllServices, getService, createService, editService, 
  deleteService, uploadServiceImage, deleteServiceImage 
} from "../../components/admin_components/services/actions/APIServiceActions";
// helpers and additional dependencies //
import { emptyServiceData } from "../../state/reducers/serviceReducer";
import { createMockServices, createMockServiceImage, clearServiceState } from "../../test_helpers/serviceHelpers";
import { ClientServiceData } from "../../components/admin_components/services/actions/APIServiceActions";
import { AxiosRequestConfig } from "axios";



type WrapperProps = {
  value: IGlobalAppContext;
}

const getContextFromWrapper = (wrapper: ShallowWrapper): IGlobalAppContext => {
  const props = wrapper.props() as WrapperProps;
  const globalAppContext = props.value;
  return globalAppContext;
}

describe("Service Actions Tests", () => {
  let wrapper: ShallowWrapper;

  beforeAll(() => {
    wrapper = shallow(
    <StateProvider>
      <ServiceView></ServiceView>
    </StateProvider>
    );
  })
  
  describe("Mock requests witn no API error", () => {

    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'SET_CURRENT_SERVICE'", () => {
      let mockServices: IServiceData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      
      beforeAll(() => {
        mockServices = createMockServices(10);
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", () => {
        state.serviceState.loadedServices = [ ...mockServices ];
        const service = state.serviceState.loadedServices[0];
        setCurrentService(service._id, dispatch, state);
      });
      it('Should return the correct new state', () => {
        // expected state after action //
        const expectedServiceState = state.serviceState;
        expectedServiceState.currentServiceData = mockServices[0];
        // retrieve new state //
        const { state : newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });

    describe("Action: 'CLEAR_CURRENT_SERVICE'", () => {
      let mockServices: IServiceData[]; let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
      
      beforeAll(() => {
        mockServices = createMockServices(10);
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        state.serviceState.currentServiceData = mockServices[0];
      });

      it("Should properly dispatch the action", () => {
        clearCurrentService(dispatch);
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = state.serviceState;
        expectedServiceState.currentServiceData = emptyServiceData();
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
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
          .then((success) => {
            if (success) done();
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
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = "All Ok";
        expectedServiceState.loadedServices = mockServices;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
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
          .then((success) => {
            if (success) done();
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
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = "All Ok";
        expectedServiceState.currentServiceData = mockService;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
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
          .then((success) => {
            if (success) done();
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
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = "All Ok";
        expectedServiceState.currentServiceData = createdService;
        expectedServiceState.loadedServices = [ ...expectedServiceState.loadedServices, createdService ]
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
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
          .then((success) => {
            if (success) done();
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
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = "All Ok";
        expectedServiceState.currentServiceData = editedService;
        expectedServiceState.loadedServices = expectedServiceState.loadedServices.map((service) => {
          if (service._id === editedService._id) {
            return editedService;
          } else {
            return service;
          }
        })
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
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
          .then((success) => {
            if (success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should send the correct API request", () => {
        expect(requestConfig.url).to.eq("/api/store_items/delete/" + deletedService._id);
        expect(requestConfig.method).to.eq("delete");
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = "All Ok";
        expectedServiceState.currentServiceData = emptyServiceData();
        expectedServiceState.loadedServices = state.serviceState.loadedServices.filter((service) => service._id !== deletedService._id);
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
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
          .then((success) => {
            if (success) done();
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
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = "All Ok";
        expectedServiceState.currentServiceData = updatedService;
        expectedServiceState.loadedServices = state.serviceState.loadedServices.map((service) => {
          if (service._id === updatedService._id) {
            return updatedService;
          } else {
            return service;
          }
        });
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
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
          .then((success) => {
            if (success) done();
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
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = "All Ok";
        expectedServiceState.currentServiceData = updatedService;
        expectedServiceState.loadedServices = state.serviceState.loadedServices.map((service) => {
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
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should NOT have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.equal(null);
      });
    });
  });

  describe("Mock request with API error returned", () => {
    let state: IGlobalAppState; let dispatch: React.Dispatch<ServiceAction>;
    beforeEach(() => {
      moxios.install();
      clearServiceState(state);
    });
    afterEach(() => {
      moxios.uninstall();
    });

    describe("Action: 'GET_ALL_STORE_ITEMS'", () => {
      let requestConfig: AxiosRequestConfig;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.reject(error)
        });
        getAllServices(dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = error.message;
        expectedServiceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'GET_STORE_ITEM'", () => {
      let requestConfig: AxiosRequestConfig; let service: IServiceData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.reject(error)
        });
        getService(service._id, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = error.message;
        expectedServiceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'CREATE_STORE_ITEM'", () => {
      let requestConfig: AxiosRequestConfig; let service: IServiceData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.reject(error)
        });
        createService(service, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = error.message;
        expectedServiceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'EDIT_STORE_ITEM'", () => {
      let requestConfig: AxiosRequestConfig; let service: IServiceData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.reject(error)
        });
        editService(service._id, service, dispatch, state)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = error.message;
        expectedServiceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_STORE_ITEM'", () => {
      let requestConfig: AxiosRequestConfig; let service: IServiceData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.reject(error)
        });
        deleteService(service._id, dispatch, state)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = error.message;
        expectedServiceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'UPLOAD_STORE_ITEM_IMAGE'", () => {
      let requestConfig: AxiosRequestConfig; let service: IServiceData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        service = createMockServices(1)[0];
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.reject(error)
        });
        const mockImg = new FormData();
        uploadServiceImage(service._id, mockImg, state, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = error.message;
        expectedServiceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

    describe("Action: 'DELETE_STORE_ITEM_IMAGE'", () => {
      let requestConfig: AxiosRequestConfig; let serviceImage: IServiceImgData;
      const error = new Error("Error occured")

      beforeAll(() => {
        ({ state, dispatch } = getContextFromWrapper(wrapper));
        serviceImage = createMockServiceImage(faker.random.alphaNumeric(10));
      });

      it("Should properly dispatch the action", (done) => {
        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          requestConfig = request.config;
          request.reject(error)
        });
        deleteServiceImage(serviceImage._id, state, dispatch)
          .then((success) => {
            if (!success) done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should return the correct new state", () => {
        // expected state after action //
        const expectedServiceState = { ...state.serviceState };
        expectedServiceState.responseMsg = error.message;
        expectedServiceState.error = error;
        // retrieve new state and compare //
        const { state: newState } = getContextFromWrapper(wrapper);
        expect(newState.serviceState).to.eql(expectedServiceState);
      });
      it("Should have an error", () => {
        const { state } = getContextFromWrapper(wrapper);
        expect(state.serviceState.error).to.not.be.null;
      });
    });

  });

});