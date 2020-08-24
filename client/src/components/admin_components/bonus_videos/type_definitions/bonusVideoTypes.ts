// api actions types //
export interface IBonusVideoServerResData {
  responseMsg: string;
  bonusVideo?: IBonusVideoData;
  newBonusVideo?: IBonusVideoData;
  editedBonusVideo?: IBonusVideoData;
  deletedBonusVideo?: IBonusVideoData;
  bonusVideos?: IBonusVideoData[];
}
export interface IBonusVideoServerRes {
  data: IBonusVideoServerResData
}
export type ClientBonusVideoData = {
  description?: string;
  youTubeURL?: string;
  vimeoURL?: string;
}
// form types //
export type BonusVideoData = {
  description?: string;
  youTubeURL?: string;
  vimeoURL?: string;
}

export type FormState = {
  description?: string;
  youTubeURL?: string;
  vimeoURL?: string;
}