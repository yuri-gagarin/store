type GetAllServices = {
  readonly type: "GET_ALL_SERVICES";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    loadedServices: IServiceData[];
    error: null | Error;
  };
}
type DispatchServiceAPIRequest = {
  readonly type: "DISPATCH_SERVICE_API_REQUEST",
  readonly payload: {
    loading: boolean;
    error: null;
  }
}
type SetCurrentService = {
  readonly type: "SET_CURRENT_SERVICE";
  payload: {
    currentServiceData: IServiceData;
  }
}
type ClearCurrentService = {
  readonly type: "CLEAR_CURRENT_SERVICE";
  payload: null;
}
type OpenServiceForm = {
  readonly type: "OPEN_SERVICE_FORM",
  readonly payload: {
    serviceFormOpen: boolean;
  }
}
type CloseServiceForm = {
  readonly type: "CLOSE_SERVICE_FORM",
  readonly payload: {
    serviceFormOpen: boolean;
  }
}
type GetService = {
  readonly type: "GET_SERVICE";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    currentServiceData: IServiceData;
    error: null | Error;
  };
}
type CreateService = {
  readonly type: "CREATE_SERVICE";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    newService: IServiceData;
    error: null | Error;
  };
} 
type EditService = {
  readonly type: "EDIT_SERVICE";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedService: IServiceData;
    loadedServices: IServiceData[];
    error: null | Error;
  };
}
type UploadNewServiceImg = {
  readonly type: "UPLOAD_NEW_SERVICE_IMG";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedService: IServiceData;
    loadedServices: IServiceData[];
    error: null;
  }
}
type DeleteServiceImg = {
  readonly type: "DELETE_SERVICE_IMG";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedService: IServiceData;
    loadedServices: IServiceData[];
    error: null;
  }
}
type UpdateServiceImgs = {
  readonly type: "UPDATE_SERVICE_IMGS";
  readonly payload: {
    editedService: IServiceData
  }
}
type UpdateLoadedServices = {
  readonly type: "UPDATE_LOADED_SERVICES";
  readonly payload: {
    loadedServices: IServiceData[];
  }
}
type DeleteService = {
  readonly type: "DELETE_SERVICE";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    loadedServices: IServiceData[];
    error: null | Error;
  };
}
type SetServiceError = {
  readonly type: "SET_SERVICE_ERROR";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    error: Error;
  };
}
type ClearServiceError = {
  readonly type: "ClEAR_SERVICE_ERROR";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    error: null;
  };
}

interface IServiceImgData {
  _id: string;
  description?: string;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: string;
  editedAt?: string;
}
interface IServiceData {
  _id: string;
  name: string;
  description: string;
  price: string;
  images: IServiceImgData[];
  createdAt: string;
  editedAt?: string;
}
interface IServiceState {
  loading: boolean;
  responseMsg: string;
  currentServiceData: IServiceData;
  loadedServices: IServiceData[];
  serviceFormOpen: boolean;
  error: null | Error | import("axios").AxiosError<Error>;
}
type ServiceAction = GetAllServices | DispatchServiceAPIRequest | GetService | SetCurrentService | ClearCurrentService | OpenServiceForm | CloseServiceForm |CreateService | EditService | DeleteService | SetServiceError | ClearServiceError | UploadNewServiceImg | UpdateServiceImgs | DeleteServiceImg;