// types //
export const emptyStoreItemData = (): IStoreItemData => {
  return {
    _id: "",
    storeId: "",
    storeName: "",
    name: "",
    description: "",
    details: "",
    price: "",
    images: [],
    categories: [],
    createdAt: ""
  }
};

export const initialStoreItemState: IStoreItemState = {
  loading: false,
  numberOfItems: 0,
  responseMsg: "",
  currentStoreItemData: emptyStoreItemData(),
  loadedStoreItems: [],
  error: null
};

const storeItemReducer = (state: IStoreItemState = initialStoreItemState, action: StoreItemAction): IStoreItemState => {
  switch (action.type) {
    case "DISPATCH_STORE_ITEM_API_REQUEST":
      return {
        ...state,
        loading: action.payload.loading
      };
    case "GET_ALL_STORE_ITEMS": 
      return {
        ...state,
        loading: action.payload.loading,
        numberOfItems: action.payload.numberOfItems ? action.payload.numberOfItems : state.numberOfItems,
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
        currentStoreItemData: { ...action.payload.currentStoreItemData },
        error: action.payload.error
      };
    case "CLEAR_CURRENT_STORE_ITEM": 
      return {
        ...state,
        currentStoreItemData: { ...emptyStoreItemData() },
        error: action.payload.error
      };
    case "UPLOAD_NEW_STORE_ITEM_IMG": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentStoreItemData: { ...action.payload.editedStoreItem },
        loadedStoreItems: [ ...action.payload.loadedStoreItems ],
        error: action.payload.error
      };
    case "DELETE_STORE_ITEM_IMG": {
      return {
        ...state,
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

export default storeItemReducer;