import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Dispatch } from "react";
import { Store, IGlobalAppState } from "../../../../state/Store";
import { AppAction } from "../../../../state/Store";


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

type NewStoreData = {
  title: string;
  description: string;
  images: []
}
type EditedStoreData = NewStoreData;

export const getAllStores = (dispatch: Dispatch<AppAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/store",
    transformResponse: (r: IStoreServerResponse) => r.data
  };
  return axios.request<IStoreServerResData>(requestOptions)
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

export const getStore = (_id: string, dispatch: Dispatch<AppAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/store/" + _id,
    transformResponse: (r: IStoreServerResponse) => r.data
  };
  return axios.request<IStoreServerResData>(requestOptions)
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

export const createStore = ({ title, description, images }: NewStoreData, dispatch: Dispatch<AppAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/store/create",
    data: {
      title: title,
      description: description,
      storeImages: images,
    },
    transformResponse: (r: IStoreServerResponse) => r.data
  };

  return axios.request<IStoreServerResData>(requestOptions)
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
        responseMsg: "An Error occured",
        error: error
      }});
      return false;
    });
};

export const editStore = (_id: string, data: EditedStoreData, dispatch: Dispatch<AppAction>, state: IGlobalAppState) => {
  const { loadedStores } = state.storeState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/store/update/" + _id,
    data: {
      ...data,
    },
    transformResponse: (r: IStoreServerResponse) => r.data
  };
  return axios.request<IStoreServerResData>(requestOptions)
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
        responseMsg: "An error occured",
        error: error
      }});
    });
};

export const deleteStore = (_id: string, dispatch: Dispatch<AppAction>, state: IGlobalAppState): Promise<boolean> => {
  const { loadedStores } = state.storeState;
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/store/delete/" + _id,
    transformRequest: (r: IStoreServerResponse) => r.data
  };
  return axios.request<IStoreServerResData>(requestOptions)
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
        responseMsg: "A delete error occured",
        error: error
      }});
      return false;
    });
};


