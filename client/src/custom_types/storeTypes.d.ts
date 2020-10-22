  type GetAllStores = {
    readonly type: "GET_ALL_STORES";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      loadedStores: IStoreData[];
      error: null | Error;
    };
  }
  type DispatchStoreAPIRequest = {
    readonly type: "DISPATCH_STORE_API_REQUEST",
    readonly payload: {
      loading: boolean;
      error: null;
    }
  }
  type SetCurrentStore = {
    readonly type: "SET_CURRENT_STORE";
    readonly payload: {
      currentStoreData: IStoreData;
    }
  }
  type ClearCurrentStore = {
    readonly type: "CLEAR_CURRENT_STORE";
    readonly payload: null;
  }
  type OpenStoreForm = {
    readonly type: "OPEN_STORE_FORM";
    readonly payload: {
      storeFormOpen: boolean;
    }
  }
  type CloseStoreform = {
    readonly type: "CLOSE_STORE_FORM";
    readonly payload: {
      storeFormOpen: boolean;
    }
  }
  type GetStore = {
    readonly type: "GET_STORE";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      currentStoreData: IStoreData;
      error: null | Error;
    };
  }
  type CreateStore = {
    readonly type: "CREATE_STORE";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      newStore: IStoreData;
      error: null | Error;
    };
  } 
  type EditStore = {
    readonly type: "EDIT_STORE";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      editedStore: IStoreData;
      loadedStores: IStoreData[];
      error: null | Error;
    };
  }
  type UploadNewStoreImg = {
    readonly type: "UPLOAD_NEW_STORE_IMG";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      editedStore: IStoreData;
      loadedStores: IStoreData[];
      error: null;
    }
  }
  type DeleteStoreImg = {
    readonly type: "DELETE_STORE_IMG";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      editedStore: IStoreData;
      loadedStores: IStoreData[];
      error: null;
    }
  }
  type UpdateStoreImgs = {
    readonly type: "UPDATE_STORE_IMGS";
    readonly payload: {
      editedStore: IStoreData
    }
  }
  type UpdateLoadedStores = {
    readonly type: "UPDATE_LOADED_STORES";
    readonly payload: {
      loadedStores: IStoreData[];
    }
  }
  type DeleteStore = {
    readonly type: "DELETE_STORE";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      loadedStores: IStoreData[];
      error: null | Error;
    };
  }
  type SetStoreError = {
    readonly type: "SET_STORE_ERROR";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      error: Error;
    };
  }
  type ClearStoreError = {
    readonly type: "ClEAR_STORE_ERROR";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      error: null;
    };
  }
  
  interface IStoreImgData {
    _id: string;
    description?: string;
    url: string;
    fileName: string;
    imagePath: string;
    absolutePath: string;
    createdAt: string;
    editedAt?: string;
  }
  interface IStoreData {
    _id: string;
    title: string;
    description: string;
    images: IStoreImgData[];
    createdAt: string;
    editedAt?: string;
  }
  interface IStoreState {
    loading: boolean;
    responseMsg: string;
    currentStoreData: IStoreData;
    loadedStores: IStoreData[];
    storeFormOpen: boolean;
    error: null | Error;
  }
  type StoreAction = DispatchStoreAPIRequest | GetAllStores | GetStore | SetCurrentStore | ClearCurrentStore | OpenStoreForm | CloseStoreform | CreateStore | EditStore | DeleteStore | SetStoreError | ClearStoreError | UploadNewStoreImg | UpdateStoreImgs | DeleteStoreImg;