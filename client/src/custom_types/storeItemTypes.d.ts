type GetAllStoreItems = {
  readonly type: "GET_ALL_STORE_ITEMS";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    numberOfItems?: number;
    loadedStoreItems: IStoreItemData[];
    error: null | Error;
  };
}
type DispatchStoreItemAPIReq = {
  readonly type: "DISPATCH_STORE_ITEM_API_REQUEST",
  readonly payload: {
    loading: boolean;
  }
}
type OpenStoreItemForm = {
  readonly type: "OPEN_STORE_ITEM_FORM",
  readonly payload: {
    storeItemFormOpen: boolean;
  }
}
type CloseStoreItemForm = {
  readonly type: "CLOSE_STORE_ITEM_FORM",
  readonly payload: {
    storeItemFormOpen: boolean;
  }
}
type SetCurrentStoreItem = {
  readonly type: "SET_CURRENT_STORE_ITEM";
  payload: {
    currentStoreItemData: IStoreItemData;
    error: null | Error
  }
}
type ClearCurrentStoreItem = {
  readonly type: "CLEAR_CURRENT_STORE_ITEM";
  payload: {
    error: null | Error
  }
}
type GetStoreItem = {
  readonly type: "GET_STORE_ITEM";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    currentStoreItemData: IStoreItemData;
    error: null | Error;
  };
}
type CreateStoreItem = {
  readonly type: "CREATE_STORE_ITEM";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    newStoreItem: IStoreItemData;
    error: null | Error;
  };
} 
type EditStoreItem = {
  readonly type: "EDIT_STORE_ITEM";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedStoreItem: IStoreItemData;
    loadedStoreItems: IStoreItemData[];
    error: null | Error;
  };
}
type UploadNewStoreItemImg = {
  readonly type: "UPLOAD_NEW_STORE_ITEM_IMG";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedStoreItem: IStoreItemData;
    loadedStoreItems: IStoreItemData[];
    error: null;
  }
}
type DeleteStoreItemImg = {
  readonly type: "DELETE_STORE_ITEM_IMG";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    numberOfItems?: number;
    editedStoreItem: IStoreItemData;
    loadedStoreItems: IStoreItemData[];
    error: null;
  }
}
type UpdateStoreItemImgs = {
  readonly type: "UPDATE_STORE_ITEM_IMGS";
  readonly payload: {
    editedStoreItem: IStoreItemData
  }
}
type UpdateLoadedStoreItems = {
  readonly type: "UPDATE_LOADED_STORE_ITEMS";
  readonly payload: {
    loadedStoreItems: IStoreItemData[];
  }
}
type DeleteStoreItem = {
  readonly type: "DELETE_STORE_ITEM";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    loadedStoreItems: IStoreItemData[];
    error: null | Error;
  };
}
type SetStoreItemError = {
  readonly type: "SET_STORE_ITEM_ERROR";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    error: Error;
  };
}
type ClearStoreItemError = {
  readonly type: "ClEAR_STORE_ITEM_ERROR";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    error: null;
  };
}


interface IStoreItemData {
  _id: string;
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  details: string;
  price: string;
  images: IStoreItemImgData[];
  categories: string[];
  createdAt: string;
  editedAt?: string;
}
interface IStoreItemState {
  loading: boolean;
  responseMsg: string;
  numberOfItems: number;
  storeItemFormOpen: boolean;
  currentStoreItemData: IStoreItemData;
  loadedStoreItems: IStoreItemData[];
  storeItemFormOpen: boolean;
  error: null | Error | import("axios").AxiosError<Error>;
}
interface IStoreItemImgData {
  _id: string;
  description?: string;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: string;
  editedAt?: string;
}
type StoreItemAction = GetAllStoreItems | DispatchStoreItemAPIReq | GetStoreItem | SetCurrentStoreItem | ClearCurrentStoreItem | OpenStoreItemForm | CloseStoreItemForm | CreateStoreItem | EditStoreItem | DeleteStoreItem | SetStoreItemError | ClearStoreItemError | UploadNewStoreItemImg | UpdateStoreItemImgs | DeleteStoreItemImg;