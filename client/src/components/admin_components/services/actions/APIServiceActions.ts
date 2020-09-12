import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";

interface IServiceImgServerResData {
  responseMsg: string;
  newServiceImage?: IServiceImgData;
  deletedServiceImage?: IServiceImgData;
  updatedService: IServiceData;
}
interface IServiceImgServerRes {
  data: IServiceImgServerResData;
}

interface IServiceServerResData {
  responseMsg: string;
  service?: IServiceData;
  newService?: IServiceData;
  editedService?: IServiceData;
  deletedService?: IServiceData;
  services?: IServiceData[];
}
interface IServiceServerRes {
  data: IServiceServerResData
}

export type ClientServiceData = {
  name: string;
  description: string;
  price: string;
  images: IServiceImgData[]
}

export const getAllServices = (dispatch: Dispatch<ServiceAction>): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/services/"
  };
  console.log("dispatched")
  dispatch({ type: "DISPATCH_SERVICE_API_REQUEST", payload: { loading: true }});
  return axios.request<IServiceServerResData, IServiceServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const services = data.services!;
      dispatch({ type: "GET_ALL_SERVICES", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedServices: services,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject(error);
    });
};

export const getService = (_id: string, dispatch: Dispatch<ServiceAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/services/" + _id,
  };
  return axios.request<IServiceServerResData, IServiceServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const service = data.service!;
      dispatch({ type: "GET_SERVICE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        currentServiceData: service,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const createService = ({ name, description, price, images }: ClientServiceData, dispatch: Dispatch<ServiceAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/services/create",
    data: {
      name: name,
      price: price,
      description: description,
      images: images
    }
  };

  return axios.request<IServiceServerResData, IServiceServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const newService = data.newService!
      dispatch({ type: "CREATE_SERVICE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        newService: newService,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const editService = (_id: string, data: ClientServiceData, dispatch: Dispatch<ServiceAction>, state: IGlobalAppState) => {
  const { loadedServices } = state.serviceState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/services/update/" + _id,
    data: {
      ...data,
    }
  };
  return axios.request<IServiceServerResData, IServiceServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const editedService = data.editedService!;
      const updatedServices = loadedServices.map((service) => {
        if (service._id === editedService._id) {
          return editedService;
        } else {
          return service;
        }
      });
      dispatch({ type: "EDIT_SERVICE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        editedService: editedService,
        loadedServices: updatedServices,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
    });
};

export const deleteService = (_id: string, dispatch: Dispatch<ServiceAction>, state: IGlobalAppState): Promise<boolean> => {
  const { loadedServices } = state.serviceState;
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/services/delete/" + _id,
  };
  return axios.request<IServiceServerResData, IServiceServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const deletedService = data.deletedService!;
      const updatedServices = loadedServices.filter((service) => {
        return service._id !== deletedService._id;
      })

      dispatch({ type: "DELETE_SERVICE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedServices: updatedServices,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const uploadServiceImage = (_id: string, imageFile: FormData, state: IGlobalAppState, dispatch: Dispatch<ServiceAction>): Promise<boolean> => {
  const { loadedServices } = state.serviceState;
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/uploads/service_images/" + _id,
    data: imageFile
  };

  return axios.request<IServiceImgServerResData, IServiceImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, updatedService } = data;

      const updatedServices = loadedServices.map((service) => {
        if (service._id === updatedService._id) {
          return updatedService;
        } else {
          return service;
        }
      });
      dispatch({ type: "UPLOAD_NEW_SERVICE_IMG", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedService: updatedService,
        loadedServices: updatedServices,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const deleteServiceImage = (imgId: string, state: IGlobalAppState, dispatch: Dispatch<ServiceAction>): Promise<boolean> => {
  const { loadedServices } = state.serviceState; 
  const { _id: serviceId } = state.serviceState.currentServiceData;

  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/uploads/service_images/" + imgId + "/" + serviceId
  };

  return axios.request<IServiceImgServerResData, IServiceImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, updatedService } = data;
      
     
      const updatedServices = loadedServices.map((service) => {
        if (service._id === updatedService._id) {
          return updatedService;
        } else {
          return service;
        }
      });
      dispatch({ type: "DELETE_SERVICE_IMG", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedService: updatedService,
        loadedServices: updatedServices,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    })
};


