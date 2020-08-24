import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";

interface IStoreImgServerRes {
  data: IStoreImgServerResData;
}
interface IStoreImgServerResData {
  responseMsg: string;
  newStoreImage?: IStoreImgData;
  deletedStoreImage?: IStoreImgData;
  updatedStore: IStoreData;
}
interface IStoreServerResponse {
  data: IStoreServerResData
}
interface IStoreServerResData {
  responseMsg: string;
  store?: IStoreData;
  newStore?: IStoreData;
  editedStore?: IStoreData;
  deletedStore?: IStoreData;
  stores?: IStoreData[];
}

type ClientStoreData = {
  title: string;
  description: string;
  images: IStoreImgData[]
}
type StoreQuery = {
  storeName?: string;
  limit?: string;
}

export const getAllStores = (dispatch: Dispatch<StoreAction>, queryOptions?: StoreQuery): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/stores",
    params: queryOptions
  };
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};
export const getStoreByName = (name: string, dispatch: Dispatch<StoreAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/stores",
    params: {
      name: name
    }
  };
  return axios.request<IStoreServerResData, IStoreServerResponse>(requestOptions)
    .then((response) => {
      const { data } = response;
      const store = data.store;
      if (!store) {
        return false;
      }
      dispatch({ type: "GET_STORE", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        currentStoreData: store, 
        error: null
      }});
      return true
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
}
export const getStore = (_id: string, dispatch: Dispatch<StoreAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/stores/" + _id,
  };
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const createStore = ({ title, description, images }: ClientStoreData, dispatch: Dispatch<StoreAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/stores/create",
    data: {
      title: title,
      description: description,
      images: images,
    }
  };

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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const editStore = (_id: string, data: ClientStoreData, dispatch: Dispatch<StoreAction>, state: IGlobalAppState) => {
  const { loadedStores } = state.storeState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/stores/update/" + _id,
    data: {
      ...data,
    }
  };
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
    });
};

export const deleteStore = (_id: string, dispatch: Dispatch<StoreAction>, state: IGlobalAppState): Promise<boolean> => {
  const { loadedStores } = state.storeState;
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/stores/delete/" + _id,
  };
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const uploadStoreImage = (_store_id: string, imageFile: FormData, state: IGlobalAppState, dispatch: Dispatch<StoreAction>): Promise<boolean> => {
  const { loadedStores } = state.storeState;
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/uploads/store_images/" + _store_id,
    data: imageFile
  };

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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const deleteStoreImage = (imgId: string, state: IGlobalAppState, dispatch: Dispatch<StoreAction>): Promise<boolean> => {
  const { loadedStores } = state.storeState; 
  const { _id: storeId } = state.storeState.currentStoreData;

  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/uploads/store_images/" + imgId + "/" + storeId
  };

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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    })
};


