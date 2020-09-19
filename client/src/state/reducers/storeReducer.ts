// types //
export const emptyStoreData = (): IStoreData => {
  return {
    _id: "",
    title: "",
    description: "",
    images: [],
    createdAt: "",
  }
};

export const initialStoreState: IStoreState = {
  loading: false,
  responseMsg: "",
  currentStoreData: emptyStoreData(),
  loadedStores: [],
  storeFormOpen: false,
  error: null
};

const storeReducer = (state: IStoreState = initialStoreState, action: StoreAction): IStoreState => {
  switch (action.type) {
    case "DISPATCH_STORE_API_REQUEST": 
      return {
        ...state,
        loading: action.payload.loading
      };
    case "GET_ALL_STORES": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loadedStores: [ ...action.payload.loadedStores],
        error: action.payload.error
      };
    case "GET_STORE": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreData: { ...action.payload.currentStoreData },
        error: action.payload.error
      };
    case "SET_CURRENT_STORE": 
      return {
        ...state,
        currentStoreData: { ...action.payload.currentStoreData }
      };
    case "CLEAR_CURRENT_STORE": 
      return {
        ...state,
        currentStoreData: { ...emptyStoreData() }
      };
    case "OPEN_STORE_FORM": 
      return {
        ...state,
        storeFormOpen: action.payload.storeFormOpen
      };
    case "CLOSE_STORE_FORM": 
      return {
        ...state,
        storeFormOpen: action.payload.storeFormOpen
      };
    case "UPLOAD_NEW_STORE_IMG": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreData: { ...action.payload.editedStore },
        loadedStores: [ ...action.payload.loadedStores ],
        error: action.payload.error
      };
    case "DELETE_STORE_IMG": {
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreData: { ...action.payload.editedStore },
        loadedStores: [ ...action.payload.loadedStores ],
        error: action.payload.error
      }
    }
    case "UPDATE_STORE_IMGS": 
      return {
        ...state,
        currentStoreData: { ...action.payload.editedStore }
      };
    case "CREATE_STORE":
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreData: { ...action.payload.newStore },
        loadedStores: [ ...state.loadedStores, action.payload.newStore ],
        error: action.payload.error
      };
    case "EDIT_STORE": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreData: { ...action.payload.editedStore },
        loadedStores: [ ...action.payload.loadedStores ],
        error: action.payload.error
      };
    case "DELETE_STORE": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreData: { ...emptyStoreData() },
        loadedStores: [ ...action.payload.loadedStores ],
        error:action.payload.error
      };
    case "SET_STORE_ERROR": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error
      };
    case "ClEAR_STORE_ERROR": 
      return {
        ...state,
        loading:action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error
      };
    default: return state;
  }
};

export default storeReducer;