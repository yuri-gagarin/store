import { Dispatch } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
// state //
import { IGlobalAppState } from "../../../../state/Store";
// type definitions //
import { 
  StoreItemQueryPar, IStoreItemServerResData, IStoreItemServerRes,
  IStoreItemImgServerResData, IStoreItemImgServerRes,
  ClientStoreItemData
} from "../type_definitions/storeItemTypes";


export const getAllStoreItems = (dispatch: Dispatch<StoreItemAction>, queryParams?: StoreItemQueryPar): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/store_items",
    params: queryParams
  };
  dispatch({ type: "DISPATCH_STORE_ITEM_API_REQUEST", payload: { loading: true } });
  return axios.request<IStoreItemServerResData, IStoreItemServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const storeItems = data.storeItems!;
      dispatch({ type: "GET_ALL_STORE_ITEMS", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        numberOfItems: data.numberOfItems ? parseInt(data.numberOfItems, 10) : undefined,
        loadedStoreItems: storeItems,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const getStoreItem = (_id: string, dispatch: Dispatch<StoreItemAction>): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/store_items/" + _id,
  };
  dispatch({ type: "DISPATCH_STORE_ITEM_API_REQUEST", payload: { loading: true } });
  return axios.request<IStoreItemServerResData, IStoreItemServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const storeItem = data.storeItem!;
      dispatch({ type: "GET_STORE_ITEM", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        currentStoreItemData: storeItem,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const createStoreItem = (data: ClientStoreItemData, dispatch: Dispatch<StoreItemAction>): Promise<void> => {
  console.log(72)
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/store_items/create",
    data: data
  };
  dispatch({ type: "DISPATCH_STORE_ITEM_API_REQUEST", payload: { loading: true } });
  console.log("dispatchhed")
  return axios.request<IStoreItemServerResData, IStoreItemServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const newStoreItem = data.newStoreItem!
      console.log(data)
      dispatch({ type: "CREATE_STORE_ITEM", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        newStoreItem: newStoreItem,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const editStoreItem = (_id: string, data: ClientStoreItemData, dispatch: Dispatch<StoreItemAction>, state: IGlobalAppState): Promise<void> => {
  const { loadedStoreItems } = state.storeItemState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/store_items/update/" + _id,
    data: data
  };
  dispatch({ type: "DISPATCH_STORE_ITEM_API_REQUEST", payload: { loading: true } });
  return axios.request<IStoreItemServerResData, IStoreItemServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const editedStoreItem = data.editedStoreItem!;
      const updatedStoreItems = loadedStoreItems.map((storeItem) => {
        if (storeItem._id === editedStoreItem._id) {
          return editedStoreItem;
        } else {
          return storeItem;
        }
      });
      dispatch({ type: "EDIT_STORE_ITEM", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        editedStoreItem: editedStoreItem,
        loadedStoreItems: updatedStoreItems,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const deleteStoreItem = (_id: string, dispatch: Dispatch<StoreItemAction>, state: IGlobalAppState): Promise<void> => {
  const { loadedStoreItems } = state.storeItemState;
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/store_items/delete/" + _id,
  };
  dispatch({ type: "DISPATCH_STORE_ITEM_API_REQUEST", payload: { loading: true } });
  return axios.request<IStoreItemServerResData, IStoreItemServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const deletedStoreItem = data.deletedStoreItem!;
      const updatedStoreItems = loadedStoreItems.filter((storeItem) => {
        return storeItem._id !== deletedStoreItem._id;
      })

      dispatch({ type: "DELETE_STORE_ITEM", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedStoreItems: updatedStoreItems,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const uploadStoreItemImage = (storeItemId: string, imageFile: FormData, state: IGlobalAppState, dispatch: Dispatch<StoreItemAction>): Promise<void> => {
  const { loadedStoreItems } = state.storeItemState;
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/uploads/store_item_images/" + storeItemId,
    data: imageFile
  };
  dispatch({ type: "DISPATCH_STORE_ITEM_API_REQUEST", payload: { loading: true } });
  return axios.request<IStoreItemImgServerResData, IStoreItemImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, updatedStoreItem } = data;

      const updatedStoreItems = loadedStoreItems.map((storeItem) => {
        if (storeItem._id === updatedStoreItem._id) {
          return updatedStoreItem;
        } else {
          return storeItem;
        }
      });
      dispatch({ type: "UPLOAD_NEW_STORE_ITEM_IMG", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedStoreItem: updatedStoreItem,
        loadedStoreItems: updatedStoreItems,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const deleteStoreItemImage = (imgId: string, state: IGlobalAppState, dispatch: Dispatch<StoreItemAction>): Promise<void> => {
  const { loadedStoreItems } = state.storeItemState; 
  const { _id: storeItemId } = state.storeItemState.currentStoreItemData;

  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/uploads/store_item_images/" + imgId + "/" + storeItemId
  };
  dispatch({ type: "DISPATCH_STORE_ITEM_API_REQUEST", payload: { loading: true } });
  return axios.request<IStoreItemImgServerResData, IStoreItemImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, updatedStoreItem } = data;
      
      const updatedStoreItems = loadedStoreItems.map((storeItem) => {
        if (storeItem._id === updatedStoreItem._id) {
          return updatedStoreItem;
        } else {
          return storeItem;
        }
      });
      dispatch({ type: "DELETE_STORE_ITEM_IMG", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedStoreItem: updatedStoreItem,
        loadedStoreItems: updatedStoreItems,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};


