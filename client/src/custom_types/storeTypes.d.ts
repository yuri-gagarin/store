  type GetAllStores = {
    readonly type: "GET_ALL_STORES";
    readonly payload: {
      loading: boolean;
      responseMsg: string;
      loadedStores: IStoreData[];
      error: null | Error;
    };
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
  
  declare interface IStoreImgData {
    description?: string;
    url: string;
    fileName: string;
    imagePath: string;
    absolutePath: string;
    createdAt: string;
    editedAt?: string;
  }
  declare interface IStoreData {
    _id: string;
    title: string;
    description: string;
    images: IStoreImgData[];
    createdAt: string;
    editedAt?: string;
  }
  declare interface IStoreState {
    loading: boolean;
    responseMsg: string;
    currentStoreData: IStoreData | {};
    loadedStores: IStoreData[]
    error: null | Error;
  }
  declare type StoreAction = GetAllStores | GetStore | CreateStore | EditStore | 
                            DeleteStore | SetStoreError | ClearStoreError;