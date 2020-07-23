import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";

export const setCurrentBonusVideo = (_id: string, dispatch: Dispatch<BonusVideoAction>, state: IGlobalAppState): void => {
  const loadedBonusVideos: IBonusVideoData[] = state.bonusVideoState.loadedBonusVideos;
  const newCurrentBonusVideo: IBonusVideoData = loadedBonusVideos.filter((bonusVideo) => bonusVideo._id === _id)[0];
  dispatch({ type: "SET_CURRENT_BONUS_VIDEO", payload: {
    currentBonusVideoData: newCurrentBonusVideo
  }});
};

export const clearCurrentBonusVideo = (dispatch: Dispatch<BonusVideoAction>): void => {
  dispatch({ type: "CLEAR_CURRENT_BONUS_VIDEO", payload: null });
};
