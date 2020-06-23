type GetAllServices = {
  readonly type: "GET_ALL_SERVICES";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    loadedServices: IServiceData[];
    error: null | Error;
  };
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

declare interface IServiceImgData {
  _id: string;
  description?: string;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: string;
  editedAt?: string;
}
declare interface IServiceData {
  _id: string;
  name: string;
  description: string;
  price: string;
  images: IServiceImgData[];
  createdAt: string;
  editedAt?: string;
}
declare interface IServiceState {
  loading: boolean;
  responseMsg: string;
  currentServiceData: IServiceData;
  loadedServices: IServiceData[]
  error: null | Error;
}
declare type ServiceAction = GetAllServices | GetService | SetCurrentService | ClearCurrentService | CreateService | EditService | 
                          DeleteService | SetServiceError | ClearServiceError | UploadNewServiceImg | UpdateServiceImgs | DeleteServiceImg;