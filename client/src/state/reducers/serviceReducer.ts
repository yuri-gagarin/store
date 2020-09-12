// types //
export const emptyServiceData = (): IServiceData => {
  return {
    _id: "",
    name: "",
    price: "",
    description: "",
    images: [],
    createdAt: "",
  }
};

export const initialServiceState: IServiceState = {
  loading: false,
  responseMsg: "",
  currentServiceData: emptyServiceData(),
  loadedServices: [],
  error: null
};

const serviceReducer = (state: IServiceState = initialServiceState, action: ServiceAction): IServiceState => {
  switch (action.type) {
    case "DISPATCH_SERVICE_API_REQUEST": 
      return {
        ...state,
        loading: action.payload.loading
      };
    case "GET_ALL_SERVICES": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loadedServices: [ ...action.payload.loadedServices],
        error: action.payload.error
      };
    case "GET_SERVICE": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentServiceData: { ...action.payload.currentServiceData },
        error: action.payload.error
      };
    case "SET_CURRENT_SERVICE": 
      return {
        ...state,
        currentServiceData: { ...action.payload.currentServiceData }
      };
    case "CLEAR_CURRENT_SERVICE": 
      return {
        ...state,
        currentServiceData: { ...emptyServiceData() }
      };
    case "UPLOAD_NEW_SERVICE_IMG": 
      return {
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentServiceData: { ...action.payload.editedService },
        loadedServices: [ ...action.payload.loadedServices ],
        error: action.payload.error
      };
    case "DELETE_SERVICE_IMG": {
      return {
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentServiceData: { ...action.payload.editedService },
        loadedServices: [ ...action.payload.loadedServices ],
        error: action.payload.error
      }
    }
    case "UPDATE_SERVICE_IMGS": 
      return {
        ...state,
        currentServiceData: { ...action.payload.editedService }
      };
    case "CREATE_SERVICE":
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentServiceData: { ...action.payload.newService },
        loadedServices: [ ...state.loadedServices, action.payload.newService ],
        error: action.payload.error
      };
    case "EDIT_SERVICE": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentServiceData: { ...action.payload.editedService },
        loadedServices: [ ...action.payload.loadedServices ],
        error: action.payload.error
      };
    case "DELETE_SERVICE": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentServiceData: { ...emptyServiceData() },
        loadedServices: [ ...action.payload.loadedServices ],
        error:action.payload.error
      };
    case "SET_SERVICE_ERROR": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error
      };
    case "ClEAR_SERVICE_ERROR": 
      return {
        ...state,
        loading:action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error
      };
    default: return state;
  }
};

export default serviceReducer;