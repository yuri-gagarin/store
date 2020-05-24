// types //
export const initialStoreState: IStoreState = {
  loading: false,
  responseMsg: "",
  currentStoreData: {},
  loadedStores: [],
  error: null
};

const storeReducer = (state: IStoreState = initialStoreState, action: StoreAction): IStoreState => {
  switch (action.type) {
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
        currentStoreData: {},
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