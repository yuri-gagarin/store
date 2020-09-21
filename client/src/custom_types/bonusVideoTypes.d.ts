type GetAllBonusVideos = {
  readonly type: "GET_ALL_BONUS_VIDEOS";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    loadedBonusVideos: IBonusVideoData[];
    error: null | Error;
  };
}
type SetCurrentBonusVideo = {
  readonly type: "SET_CURRENT_BONUS_VIDEO";
  readonly payload: {
    currentBonusVideoData: IBonusVideoData;
  }
}
type ClearCurrentBonusVideo = {
  readonly type: "CLEAR_CURRENT_BONUS_VIDEO";
  readonly payload: null;
}
type OpenBonusVideoForm = {
  readonly type: "OPEN_BONUS_VIDEO_FORM";
  readonly payload: {
    bonusVideoFormOpen: boolean;
  }
}
type CloseBonusVideoForm = {
  readonly type: "CLOSE_BONUS_VIDEO_FORM";
  readonly payload: {
    bonusVideoFormOpen: boolean;
  }
}
type GetBonusVideo = {
  readonly type: "GET_BONUS_VIDEO";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    currentBonusVideoData: IBonusVideoData;
    error: null | Error;
  };
}
type CreateBonusVideo = {
  readonly type: "CREATE_BONUS_VIDEO";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    newBonusVideo: IBonusVideoData;
    error: null | Error;
  };
} 
type EditBonusVideo = {
  readonly type: "EDIT_BONUS_VIDEO";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedBonusVideo: IBonusVideoData;
    loadedBonusVideos: IBonusVideoData[];
    error: null | Error;
  };
}
type UpdateLoadedBonusVideos = {
  readonly type: "UPDATE_LOADED_BONUS_VIDEOS";
  readonly payload: {
    loadedBonusVideos: IBonusVideoData[];
  }
}
type DeleteBonusVideo = {
  readonly type: "DELETE_BONUS_VIDEO";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    loadedBonusVideos: IBonusVideoData[];
    error: null | Error;
  };
}
type SetBonusVideoError = {
  readonly type: "SET_BONUS_VIDEO_ERROR";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    error: Error;
  };
}
type ClearBonusVideoError = {
  readonly type: "ClEAR_BONUS_VIDEO_ERROR";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    error: null;
  };
}

interface IBonusVideoData {
  _id: string;
  description: string;
  youTubeURL: string;
  vimeoURL: string;
  createdAt: string;
  editedAt?: string;
}
interface IBonusVideoState {
  loading: boolean;
  responseMsg: string;
  currentBonusVideoData: IBonusVideoData;
  loadedBonusVideos: IBonusVideoData[];
  bonusVideoFormOpen: boolean;
  error: null | Error;
}
type BonusVideoAction = GetAllBonusVideos | GetBonusVideo | OpenBonusVideoForm | CloseBonusVideoForm | SetCurrentBonusVideo | ClearCurrentBonusVideo | CreateBonusVideo | EditBonusVideo | DeleteBonusVideo | SetBonusVideoError | ClearBonusVideoError;