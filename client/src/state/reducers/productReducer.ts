// types //
export const emptyProductData = (): IProductData => {
  return {
    _id: "",
    name: "",
    details: "",
    description: "",
    price: "",
    images: [],
    createdAt: "",
  }
};

export const initialProductState: IProductState = {
  loading: false,
  responseMsg: "",
  currentProductData: emptyProductData(),
  loadedProducts: [],
  productFormOpen: false,
  error: null
};

const productReducer = (state: IProductState = initialProductState, action: ProductAction): IProductState => {
  switch (action.type) {
    case "GET_ALL_PRODUCTS": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loadedProducts: [ ...action.payload.loadedProducts],
        error: action.payload.error
      };
    case "DISPATCH_PRODUCT_API_REQUEST": 
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error
      };
    case "GET_PRODUCT": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentProductData: { ...action.payload.currentProductData },
        error: action.payload.error
      };
    case "SET_CURRENT_PRODUCT": 
      return {
        ...state,
        currentProductData: { ...action.payload.currentProductData }
      };
    case "CLEAR_CURRENT_PRODUCT": 
      return {
        ...state,
        currentProductData: { ...emptyProductData() }
      };
    case "OPEN_PRODUCT_FORM": 
      return {
        ...state,
        productFormOpen: action.payload.productFormOpen
      };
    case "CLOSE_PRODUCT_FORM": 
      return {
        ...state,
        productFormOpen: action.payload.productFormOpen
      };
    case "UPLOAD_NEW_PRODUCT_IMG": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentProductData: { ...action.payload.editedProduct },
        loadedProducts: [ ...action.payload.loadedProducts ],
        error: action.payload.error
      };
    case "DELETE_PRODUCT_IMG": {
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentProductData: { ...action.payload.editedProduct },
        loadedProducts: [ ...action.payload.loadedProducts ],
        error: action.payload.error
      }
    }
    case "UPDATE_PRODUCT_IMGS": 
      return {
        ...state,
        currentProductData: { ...action.payload.editedProduct }
      };
    case "CREATE_PRODUCT":
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentProductData: { ...action.payload.newProduct },
        loadedProducts: [ ...state.loadedProducts, action.payload.newProduct ],
        error: action.payload.error
      };
    case "EDIT_PRODUCT": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentProductData: { ...action.payload.editedProduct },
        loadedProducts: [ ...action.payload.loadedProducts ],
        error: action.payload.error
      };
    case "DELETE_PRODUCT": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentProductData: { ...emptyProductData() },
        loadedProducts: [ ...action.payload.loadedProducts ],
        error:action.payload.error
      };
    case "SET_PRODUCT_ERROR": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error
      };
    case "ClEAR_PRODUCT_ERROR": 
      return {
        ...state,
        loading:action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error
      };
    default: return state;
  }
};

export default productReducer;