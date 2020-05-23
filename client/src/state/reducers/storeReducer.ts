// types //
type GetStore = {
  readonly type: "GET_STORE";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    storeData: StoreData | {};
    error: null | Error;
  };
}
type CreateStore = {
  readonly type: "CREATE_STORE";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    storeData: StoreData;
    error: null | Error;
  };
} 
type EditStore = {
  readonly type: "EDIT_STORE";
  readonly payload: {};
}
type DeleteStore = {
  readonly type: "DELETE_STORE";
  readonly payload: {}
}
interface StoreImgData {
  description?: string;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: string;
  editedAt?: string;
}
interface StoreData {
  _id: string;
  title: string;
  description: string;
  images: StoreImgData[];
  createdAt: string;
  editedAt?: string;
}

export interface IStoreState {
  loading: boolean;
  responseMsg: string;
  storeData: StoreData | {};
  error: null | Error;
}

export const initialStoreState: IStoreState = {
  loading: false,
  responseMsg: "",
  storeData: {},
  error: null
};
export type StoreAction = GetStore | CreateStore | EditStore | DeleteStore;

const storeReducer = (state: IStoreState = initialStoreState, action: StoreAction): IStoreState => {
  switch (action.type) {
    case "GET_STORE": 
      return {
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        storeData: { ...action.payload.storeData },
        error: action.payload.error
      };
    case "CREATE_STORE":
      return {
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        storeData: { ...action.payload.storeData },
        error: action.payload.error
      };
    case "EDIT_STORE": 
      return {
        ...state
      };
    case "DELETE_STORE": 
      return {
        ...state
      };
    default: return state;
  }
};

export default storeReducer;