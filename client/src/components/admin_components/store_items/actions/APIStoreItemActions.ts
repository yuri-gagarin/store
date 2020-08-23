import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";
import { StoreItemQueryPar } from "../custom_types/customTypes";

interface IStoreItemImgServerResData {
  responseMsg: string;
  newStoreItemImage?: IStoreItemImgData;
  deletedStoreItemImage?: IStoreItemImgData;
  updatedStoreItem: IStoreItemData;
}
interface IStoreItemImgServerRes {
  data: IStoreItemImgServerResData;
}

interface IStoreItemServerResData {
  responseMsg: string;
  numberOfItems: string;
  storeItem?: IStoreItemData;
  newStoreItem?: IStoreItemData;
  editedStoreItem?: IStoreItemData;
  deletedStoreItem?: IStoreItemData;
  storeItems?: IStoreItemData[];
}
interface IStoreItemServerRes {
  data: IStoreItemServerResData
}

export type ClientStoreItemData = {
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  details: string;
  price: string;
  categories: string[];
  images: IStoreItemImgData[]
}

export const getAllStoreItems = (dispatch: Dispatch<StoreItemAction>, queryParams?: StoreItemQueryPar): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/store_items",
    params: queryParams
  };
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const getStoreItem = (_id: string, dispatch: Dispatch<StoreItemAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/store_items/" + _id,
  };
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const createStoreItem = (data: ClientStoreItemData, dispatch: Dispatch<StoreItemAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/store_items/create",
    data: data
  };

  return axios.request<IStoreItemServerResData, IStoreItemServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const newStoreItem = data.newStoreItem!
      dispatch({ type: "CREATE_STORE_ITEM", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        newStoreItem: newStoreItem,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      console.error(error)
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: "An Error occured",
        error: error
      }});
      return false;
    });
};

export const editStoreItem = (_id: string, data: ClientStoreItemData, dispatch: Dispatch<StoreItemAction>, state: IGlobalAppState) => {
  const { loadedStoreItems } = state.storeItemState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/store_items/update/" + _id,
    data: data
  };
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: "An error occured",
        error: error
      }});
    });
};

export const deleteStoreItem = (_id: string, dispatch: Dispatch<StoreItemAction>, state: IGlobalAppState): Promise<boolean> => {
  const { loadedStoreItems } = state.storeItemState;
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/store_items/delete/" + _id,
  };
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: "A delete error occured",
        error: error
      }});
      return false;
    });
};

export const uploadStoreItemImage = (storeId: string, imageFile: FormData, state: IGlobalAppState, dispatch: Dispatch<StoreItemAction>): Promise<boolean> => {
  const { loadedStoreItems } = state.storeItemState;
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/uploads/store_item_images/" + storeId,
    data: imageFile
  };

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
      return true;
    })
    .catch((error: AxiosError) => {
      console.error(error);
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const deleteStoreItemImage = (imgId: string, state: IGlobalAppState, dispatch: Dispatch<StoreItemAction>): Promise<boolean> => {
  const { loadedStoreItems } = state.storeItemState; 
  const { _id: storeItemId } = state.storeItemState.currentStoreItemData;
  
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/uploads/store_item_images/" + imgId + "/" + storeItemId
  };

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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ITEM_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    })
};


