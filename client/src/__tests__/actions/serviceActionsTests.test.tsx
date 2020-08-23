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
import { createMockServices, createMockServiceImage } from "../../test_helpers/serviceHelpers";
import { ClientServiceData } from "../../components/admin_components/services/actions/APIServiceActions";



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
    beforeAll(() => {
      mockServices = createMockServices(10);
      ({ state, dispatch } = getContextFromWrapper(wrapper));
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            services: mockServices
          }
        });
      });
      getAllServices(dispatch)
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
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
    beforeAll(() => {
      mockService = createMockServices(1)[0];
      ({ state, dispatch } = getContextFromWrapper(wrapper));
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
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
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      createdService = createMockServices(1)[0];
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
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
        serviceImages: createdService.images
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
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      let service = { ...state.serviceState.loadedServices[0] };
      service.name = faker.lorem.word();
      service.description = faker.lorem.paragraphs(1),
      editedService = service;
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
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
        serviceImages: editedService.images
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
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      deletedService = state.serviceState.loadedServices[0];
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
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
    let updatedService: IServiceData;
    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      state.serviceState.currentServiceData = state.serviceState.loadedServices[0];
      createdImage = createMockServiceImage();
      // set mock updated service with mock image //
      updatedService = state.serviceState.loadedServices[0];
      updatedService.images.push(createdImage);
    });
    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
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
    let updatedService: IServiceData;

    beforeAll(() => {
      ({ state, dispatch } = getContextFromWrapper(wrapper));
      updatedService = { ...state.serviceState.currentServiceData, images: [] };
    });

    it("Should properly dispatch the action", (done) => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            responseMsg: "All Ok",
            updatedService: updatedService
          }
        });
      });
      // mock action with moxios //
      deleteServiceImage(updatedService._id, state, dispatch) 
        .then((success) => {
          if (success) done();
        })
        .catch((error) => {
          done(error);
        });
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