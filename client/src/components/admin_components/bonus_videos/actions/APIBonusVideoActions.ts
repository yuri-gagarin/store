import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";
import { AppAction } from "../../../../state/Store";

interface IBonusVideoServerResData {
  responseMsg: string;
  bonusVideo?: IBonusVideoData;
  newBonusVideo?: IBonusVideoData;
  editedBonusVideo?: IBonusVideoData;
  deletedBonusVideo?: IBonusVideoData;
  bonusVideos?: IBonusVideoData[];
}
interface IBonusVideoServerRes {
  data: IBonusVideoServerResData
}

type NewBonusVideoData = {
  description: string;
  youTubeURL: string;
  vimeoURL: string;
}
type EditedBonusVideoData = NewBonusVideoData;

export const getAllBonusVideos = (dispatch: Dispatch<BonusVideoAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/bonus_videos"
  };
  return axios.request<IBonusVideoServerResData, IBonusVideoServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const bonusVideos = data.bonusVideos;
      dispatch({ type: "GET_ALL_BONUS_VIDEOS", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedBonusVideos: bonusVideos,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const getBonusVideo = (_id: string, dispatch: Dispatch<BonusVideoAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/bonus_videos/" + _id,
  };
  return axios.request<IBonusVideoServerResData, IBonusVideoServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const bonusVideo  = data.bonusVideo;
      dispatch({ type: "GET_BONUS_VIDEO", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        currentBonusVideoData: bonusVideo,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const createBonusVideo = ({ description, youTubeURL, vimeoURL }: NewBonusVideoData, dispatch: Dispatch<BonusVideoAction>): Promise<boolean> => {
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
      const newBonusVideo = data.newBonusVideo;
      dispatch({ type: "CREATE_BONUS_VIDEO", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        newBonusVideo: newBonusVideo,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      console.error(error)
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: "An Error occured",
        error: error
      }});
      return false;
    });
};

export const editBonusVideo = (_id: string, data: EditedBonusVideoData, dispatch: Dispatch<BonusVideoAction>, state: IGlobalAppState) => {
  const { loadedBonusVideos } = state.bonusVideoState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/bonus_videos/update/" + _id,
    data: {
      ...data,
    }
  };
  return axios.request<IBonusVideoServerResData, IBonusVideoServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const editedBonusVideo = data.editedBonusVideo!;
      const updatedBonusVideos = loadedBonusVideos.map((video) => {
        if (video._id === editedBonusVideo._id) {
          return editedBonusVideo;
        } else {
          return video;
        }
      });
      dispatch({ type: "EDIT_BONUS_VIDEO", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedBonusVideos: updatedBonusVideos,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: "An error occured",
        error: error
      }});
    });
};

export const deleteBonusVideo = (_id: string, dispatch: Dispatch<BonusVideoAction>, state: IGlobalAppState): Promise<boolean> => {
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
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_BONUS_VIDEO_ERROR", payload: {
        loading: false,
        responseMsg: "A delete error occured",
        error: error
      }});
      return false;
    });
};
