import faker from "faker";
import { IGlobalAppState } from "../state/Store";
import { emptyBonusVideoData } from "../state/reducers/bonusVideoReducer";

export const createMockBonusVideos = (numberOfBonusVideos?: number): IBonusVideoData[] => {
  const createdBonusVideos: IBonusVideoData[] = [];
  let totalToCreate: number;

  if (!numberOfBonusVideos) {
    totalToCreate = Math.floor(Math.random() * 10);
  } else {
    totalToCreate = numberOfBonusVideos;
  }

  for (let i = 0; i < totalToCreate; i++)  {
    const bonusVideo: IBonusVideoData  = {
      _id: faker.random.alphaNumeric(10),
      youTubeURL: faker.internet.url(),
      vimeoURL: "",
      description: "",
      createdAt: faker.date.recent().toString()
    };
    createdBonusVideos.push(bonusVideo);
  }
  return createdBonusVideos;
};


export const clearBonusVideoState = (globalState: IGlobalAppState): void => {
  globalState.bonusVideoState = {
    responseMsg: "",
    loading: false,
    currentBonusVideoData: emptyBonusVideoData(),
    loadedBonusVideos: [],
    error: null
  };
};

