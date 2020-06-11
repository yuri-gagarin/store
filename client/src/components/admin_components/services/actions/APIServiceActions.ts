import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";
import { AppAction } from "../../../../state/Store";

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

type NewServiceData = {
  name: string;
  description: string;
  serviceImages: IServiceImgData[]
}
type EditedServiceData = NewServiceData;

export const getAllServices = (dispatch: Dispatch<AppAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/services"
  };
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

export const getService = (_id: string, dispatch: Dispatch<AppAction>): Promise<boolean> => {
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

export const createService = ({ name, description, serviceImages }: NewServiceData, dispatch: Dispatch<AppAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/services/create",
    data: {
      name: name,
      description: description,
      serviceImages: serviceImages,
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
      console.error(error)
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: "An Error occured",
        error: error
      }});
      return false;
    });
};

export const editService = (_id: string, data: EditedServiceData, dispatch: Dispatch<AppAction>, state: IGlobalAppState) => {
  const { loadedServices } = state.loadedServices;
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
        responseMsg: "An error occured",
        error: error
      }});
    });
};

export const deleteService = (_id: string, dispatch: Dispatch<AppAction>, state: IGlobalAppState): Promise<boolean> => {
  const { loadedService } = state.serviceState;
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
        responseMsg: "A delete error occured",
        error: error
      }});
      return false;
    });
};

export const uploadServiceImage = (_id: string, imageFile: FormData, state: IGlobalAppState, dispatch: Dispatch<AppAction>): Promise<boolean> => {
  const { currentServiceData, loadedServices } = state.serviceState;
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/uploads/service_images/" + _id,
    data: imageFile
  };

  return axios.request<IServiceImgServerResData, IServiceImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, newServiceImage, updatedService } = data;

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
        loadedServices: updatedService,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      console.error(error);
      dispatch({ type: "SET_SERVICE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const deleteServiceImage = (imgId: string, state: IGlobalAppState, dispatch: Dispatch<AppAction>): Promise<boolean> => {
  const { loadedServices, currentServiceData } = state.serviceState; 
  const { _id: serviceId } = state.serviceState.currentServiceData;

  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/uploads/service_images/" + imgId + "/" + serviceId
  };

  return axios.request<IserviceImgServerResData, IServiceImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, deletedServiceImage, updatedService } = data;
      
     
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


