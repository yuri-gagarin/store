import axios, { AxiosRequestConfig, AxiosError } from "axios";
// type definitions //
import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";
import { IBonusVideoServerResData, IBonusVideoServerRes, ClientBonusVideoData } from "../type_definitions/bonusVideoTypes";

export const getAllBonusVideos = (dispatch: Dispatch<BonusVideoAction>): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/bonus_videos"
  };
  return axios.request<IBonusVideoServerResData, IBonusVideoServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, bonusVideos } = data;
      dispatch({ type: "GET_ALL_BONUS_VIDEOS", payload: {
        loading: false,
        responseMsg: responseMsg,
        loadedBonusVideos: bonusVideos ? bonusVideos : [],
        error: null
      }})
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const getBonusVideo = (_id: string, dispatch: Dispatch<BonusVideoAction>): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/bonus_videos/" + _id,
  };
  return axios.request<IBonusVideoServerResData, IBonusVideoServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, bonusVideo }  = data;
      dispatch({ type: "GET_BONUS_VIDEO", payload: {
        loading: false,
        responseMsg: responseMsg,
        currentBonusVideoData: bonusVideo ? bonusVideo : {} as IBonusVideoData,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const createBonusVideo = ({ description, youTubeURL, vimeoURL }: ClientBonusVideoData, dispatch: Dispatch<BonusVideoAction>): Promise<void> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/bonus_videos/create",
    data: {
      description: description,
      youTubeURL: youTubeURL,
      vimeoURL: vimeoURL
    }
  };

  return axios.request<IBonusVideoServerResData, IBonusVideoServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const newBonusVideo = data.newBonusVideo!;
      dispatch({ type: "CREATE_BONUS_VIDEO", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        newBonusVideo: newBonusVideo,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const editBonusVideo = (_id: string, data: ClientBonusVideoData, dispatch: Dispatch<BonusVideoAction>, state: IGlobalAppState): Promise<void> => {
  const { loadedBonusVideos } = state.bonusVideoState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/bonus_videos/update/" + _id,
    data: data
  };
  return axios.request<IBonusVideoServerResData, IBonusVideoServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg } = data;
      let editedBonusVideo = data.editedBonusVideo!;
      const updatedBonusVideos = loadedBonusVideos.map((video) => {
        if (video._id === editedBonusVideo._id) {
          return editedBonusVideo;
        } else {
          return video;
        }
      });
      dispatch({ type: "EDIT_BONUS_VIDEO", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedBonusVideo: editedBonusVideo,
        loadedBonusVideos: updatedBonusVideos,
        error: null
      }})
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};

export const deleteBonusVideo = (_id: string, dispatch: Dispatch<BonusVideoAction>, state: IGlobalAppState): Promise<void> => {
  const { loadedBonusVideos } = state.bonusVideoState;
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/bonus_videos/delete/" + _id,
  };
  return axios.request<IBonusVideoServerResData, IBonusVideoServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const deletedBonusVideo = data.deletedBonusVideo!;
      const updatedBonusVideos = loadedBonusVideos.filter((video) => {
        return video._id !== deletedBonusVideo._id;
      })

      dispatch({ type: "DELETE_BONUS_VIDEO", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedBonusVideos: updatedBonusVideos,
        error: null
      }});
      return Promise.resolve();
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return Promise.reject();
    });
};
