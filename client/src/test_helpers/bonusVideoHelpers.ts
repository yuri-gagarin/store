import faker from "faker";
import { IGlobalAppState } from "../state/Store";
import { emptyBonusVideoData } from "../state/reducers/bonusVideoReducer";
import { resetStoreState } from "./storeHelpers";
import { resetStoreItemState } from "./storeItemHelpers";
import { resetServiceState } from "./serviceHelpers";
import { resetProductState } from "./productHelpers";

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
    bonusVideoFormOpen: false,
    error: null
  };
};

export const resetBonusVideoState = (): IBonusVideoState => {
  return {
    responseMsg: "",
    loading: false,
    currentBonusVideoData: emptyBonusVideoData(),
    loadedBonusVideos: [],
    bonusVideoFormOpen: false,
    error: null
  };
};

type SetMockBonusVideoStateOpts = {
  currentBonusVideo?: boolean;
  loadedBonusVideos?: number;
}
export const setMockBonusVideoState = ({ currentBonusVideo, loadedBonusVideos } : SetMockBonusVideoStateOpts): IGlobalAppState => {
  let _bonusVideo: IBonusVideoData = emptyBonusVideoData(); 
  const _loadedBonusVideos: IBonusVideoData[] = [];

  if (currentBonusVideo) {
    _bonusVideo = {
      _id: faker.random.alphaNumeric(10),
      youTubeURL: faker.internet.url(),
      vimeoURL: faker.internet.url(),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.recent().toString()
    }
  }
  if (loadedBonusVideos) {
    for (let i = 0; i < loadedBonusVideos; i++) {
      const videoData: IBonusVideoData = {
        _id: faker.random.alphaNumeric(10),
        youTubeURL: faker.internet.url(),
        vimeoURL: faker.internet.url(),
        description: faker.lorem.paragraph(),
        createdAt: faker.date.recent().toString()
      }
      _loadedBonusVideos.push(videoData);
    }
  }

  return {
    bonusVideoState: {
      loading: false,
      responseMsg: "",
      currentBonusVideoData: _bonusVideo,
      loadedBonusVideos: _loadedBonusVideos,
      bonusVideoFormOpen: false,
      error: null
    },
    storeState: resetStoreState(),
    storeItemState: resetStoreItemState(),
    serviceState: resetServiceState(),
    productState: resetProductState()
  };
};

