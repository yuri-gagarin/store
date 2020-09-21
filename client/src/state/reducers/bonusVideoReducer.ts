// types //
export const emptyBonusVideoData = (): IBonusVideoData => {
  return {
    _id: "",
    description: "",
    youTubeURL: "",
    vimeoURL: "",
    createdAt: ""
  }
};

export const initialBonusVideoState: IBonusVideoState = {
  loading: false,
  responseMsg: "",
  currentBonusVideoData: emptyBonusVideoData(),
  loadedBonusVideos: [],
  bonusVideoFormOpen: false,
  error: null
};

const serviceReducer = (state: IBonusVideoState = initialBonusVideoState, action: BonusVideoAction): IBonusVideoState => {
  switch (action.type) {
    case "GET_ALL_BONUS_VIDEOS": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        loadedBonusVideos: [ ...action.payload.loadedBonusVideos ],
        error: action.payload.error
      };
    case "GET_BONUS_VIDEO": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBonusVideoData: { ...action.payload.currentBonusVideoData },
        error: action.payload.error
      };
    case "OPEN_BONUS_VIDEO_FORM":
      return {
        ...state,
        bonusVideoFormOpen: action.payload.bonusVideoFormOpen
      };
    case "CLOSE_BONUS_VIDEO_FORM": 
      return {
        ...state,
        bonusVideoFormOpen: action.payload.bonusVideoFormOpen
      };
    case "SET_CURRENT_BONUS_VIDEO": 
      return {
        ...state,
        currentBonusVideoData: { ...action.payload.currentBonusVideoData }
      };
    case "CLEAR_CURRENT_BONUS_VIDEO": 
      return {
        ...state,
        currentBonusVideoData: { ...emptyBonusVideoData() }
      };
    case "CREATE_BONUS_VIDEO":
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBonusVideoData: { ...action.payload.newBonusVideo },
        loadedBonusVideos: [ ...state.loadedBonusVideos, action.payload.newBonusVideo ],
        error: action.payload.error
      };
    case "EDIT_BONUS_VIDEO": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBonusVideoData: { ...action.payload.editedBonusVideo },
        loadedBonusVideos: [ ...action.payload.loadedBonusVideos],
        error: action.payload.error
      };
    case "DELETE_BONUS_VIDEO": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        currentBonusVideoData: { ...emptyBonusVideoData() },
        loadedBonusVideos: [ ...action.payload.loadedBonusVideos ],
        error:action.payload.error
      };
    case "SET_BONUS_VIDEO_ERROR": 
      return {
        ...state,
        loading: action.payload.loading,
        responseMsg: action.payload.responseMsg,
        error: action.payload.error
      };
    case "ClEAR_BONUS_VIDEO_ERROR": 
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