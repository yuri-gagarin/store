import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Dispatch } from "react";
// type definitions //
import { IGlobalAppState } from "../../../../state/Store";
import {
  StoreQuery, IStoreServerResData, IStoreServerResponse,
  IStoreImgServerResData, IStoreImgServerRes, ClientStoreData
} from "../type_definitions/storeTypes";

export const getAllStores = (dispatch: Dispatch<StoreAction>, queryOptions?: StoreQuery): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/stores",
    params: queryOptions
  };
  dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
  return axios.request<IStoreServerResData, IStoreServerResponse>(requestOptions)
    .then((response) => {
      const { data } = response;
      const stores = data.stores!;
      dispatch({ type: "GET_ALL_STORES", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedStores: stores,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {   
        dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject()
    });
};
export const getStoreByName = (name: string, dispatch: Dispatch<StoreAction>): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/stores",
    params: {
      name: name
    }
  };
  dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
  return axios.request<IStoreServerResData, IStoreServerResponse>(requestOptions)
    .then((response) => {
      const { data } = response;
      const store = data.store;
      if (!store) {
        return Promise.reject();
      }
      dispatch({ type: "GET_STORE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        currentStoreData: store, 
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
  
}
export const getStore = (_id: string, dispatch: Dispatch<StoreAction>): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/stores/" + _id,
  };
  dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
  return axios.request<IStoreServerResData, IStoreServerResponse>(requestOptions)
    .then((response) => {
      const { data } = response;
      const  store  = data.store!;
      dispatch({ type: "GET_STORE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        currentStoreData: store,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const createStore = ({ title, description, images }: ClientStoreData, dispatch: Dispatch<StoreAction>): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/stores/create",
    data: {
      title: title,
      description: description,
      images: images,
    }
  };
  dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
  return axios.request<IStoreServerResData, IStoreServerResponse>(requestOptions)
    .then((response) => {
      const { data } = response;
      const newStore = data.newStore!
      dispatch({ type: "CREATE_STORE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        newStore: newStore,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const editStore = (_id: string, data: ClientStoreData, dispatch: Dispatch<StoreAction>, state: IGlobalAppState): Promise<void> => {
  const { loadedStores } = state.storeState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/stores/update/" + _id,
    data: {
      ...data,
    }
  };
  dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
  return axios.request<IStoreServerResData, IStoreServerResponse>(requestOptions)
    .then((response) => {
      const { data } = response;
      const editedStore = data.editedStore!;
      const updatedStores = loadedStores.map((store) => {
        if (store._id === editedStore._id) {
          return editedStore;
        } else {
          return store;
        }
      });
      dispatch({ type: "EDIT_STORE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        editedStore: editedStore,
        loadedStores: updatedStores,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const deleteStore = (_id: string, dispatch: Dispatch<StoreAction>, state: IGlobalAppState): Promise<void> => {
  const { loadedStores } = state.storeState;
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/stores/delete/" + _id,
  };
  dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
  return axios.request<IStoreServerResData, IStoreServerResponse>(requestOptions)
    .then((response) => {
      const { data } = response;
      const deletedStore = data.deletedStore!;
      const updatedStores = loadedStores.filter((store) => {
        return store._id !== deletedStore._id;
      })

      dispatch({ type: "DELETE_STORE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedStores: updatedStores,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const uploadStoreImage = (_store_id: string, imageFile: FormData, state: IGlobalAppState, dispatch: Dispatch<StoreAction>): Promise<void> => {
  const { loadedStores } = state.storeState;
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/uploads/store_images/" + _store_id,
    data: imageFile
  };
  dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
  return axios.request<IStoreImgServerResData, IStoreImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, updatedStore } = data;
      const updatedStores = loadedStores.map((store) => {
        if (store._id === updatedStore._id) {
          return updatedStore;
        } else {
          return store;
        }
      });
      dispatch({ type: "UPLOAD_NEW_STORE_IMG", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedStore: updatedStore,
        loadedStores: updatedStores,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const deleteStoreImage = (imgId: string, state: IGlobalAppState, dispatch: Dispatch<StoreAction>): Promise<void> => {
  const { loadedStores } = state.storeState; 
  const { _id: storeId } = state.storeState.currentStoreData;

  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/uploads/store_images/" + imgId + "/" + storeId
  };
  dispatch({ type: "DISPATCH_STORE_API_REQUEST", payload: { loading: true, error: null } });
  return axios.request<IStoreImgServerResData, IStoreImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, updatedStore } = data;
      
     
      const updatedStores = loadedStores.map((store) => {
        if (store._id === updatedStore._id) {
          return updatedStore;
        } else {
          return store;
        }
      });
      dispatch({ type: "DELETE_STORE_IMG", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedStore: updatedStore,
        loadedStores: updatedStores,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};


