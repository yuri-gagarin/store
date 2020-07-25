// types //
const emptyStoreItemData = (): IStoreItemData => {
  return {
    _id: "",
    storeId: "",
    title: "",
    description: "",
    details: "",
    images: [],
    categories: [],
    createdAt: ""
  }
};

export const initialStoreItemState: IStoreItemState = {
  loading: false,
  responseMsg: "",
  currentStoreItemData: emptyStoreItemData(),
  loadedStoreItems: [],
  error: null
};

const storeReducer = (state: IStoreItemState = initialStoreItemState, action: StoreItemAction): IStoreItemState => {
  switch (action.type) {
    case "GET_ALL_STORE_ITEMS": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loadedStoreItems: [ ...action.payload.loadedStoreItems],
        error: action.payload.error
      };
    case "GET_STORE_ITEM": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreItemData: { ...action.payload.currentStoreItemData },
        error: action.payload.error
      };
    case "SET_CURRENT_STORE_ITEM": 
      return {
        ...state,
        currentStoreItemData: { ...action.payload.currentStoreItemData }
      };
    case "CLEAR_CURRENT_STORE_ITEM": 
      return {
        ...state,
        currentStoreItemData: { ...emptyStoreItemData() }
      };
    case "UPLOAD_NEW_STORE_ITEM_IMG": 
      return {
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreItemData: { ...action.payload.editedStoreItem },
        loadedStoreItems: [ ...action.payload.loadedStoreItems ],
        error: action.payload.error
      };
    case "DELETE_STORE_ITEM_IMG": {
      return {
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreItemData: { ...action.payload.editedStoreItem },
        loadedStoreItems: [ ...action.payload.loadedStoreItems ],
        error: action.payload.error
      }
    }
    case "UPDATE_STORE_ITEM_IMGS": 
      return {
        ...state,
        currentStoreItemData: { ...action.payload.editedStoreItem }
      };
    case "CREATE_STORE_ITEM":
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreItemData: { ...action.payload.newStoreItem },
        loadedStoreItems: [ ...state.loadedStoreItems, action.payload.newStoreItem ],
        error: action.payload.error
      };
    case "EDIT_STORE_ITEM": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreItemData: { ...action.payload.editedStoreItem },
        loadedStoreItems: [ ...action.payload.loadedStoreItems ],
        error: action.payload.error
      };
    case "DELETE_STORE_ITEM": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreItemData: { ...emptyStoreItemData() },
        loadedStoreItems: [ ...action.payload.loadedStoreItems ],
        error:action.payload.error
      };
    case "SET_STORE_ITEM_ERROR": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error
      };
    case "ClEAR_STORE_ITEM_ERROR": 
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