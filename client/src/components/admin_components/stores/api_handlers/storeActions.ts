import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { IStoreData } from "../../../../state/reducers/storeReducer";
import { AppAction } from "../../../../state/Store";

interface NewStoreData {
  title: string;
  description: string;
  images: string[];
}
interface IStoreResponse {
  responseMsg: string;
  store: IStoreData;
}

export const createStore = ({ title, description, images }: NewStoreData, dispatch: React.Dispatch<AppAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/store/create",
    data: {
      title: title,
      description: description,
      storeImages: images,
    }
  };

  return axios.request<IStoreResponse>(requestOptions)
    .then((response) => {
      const { responseMsg, store } = response.data;
      dispatch({ type: "CREATE_STORE", payload: {
        loading: false,
        responseMsg: responseMsg,
        storeData: store,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_STORE_ERROR", payload: {
        loading: false,
        responseMsg: "An Error occured",
        storeData: {},
        error: error
      }});
      return false;
    })
};

