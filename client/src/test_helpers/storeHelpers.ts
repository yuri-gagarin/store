import faker from "faker";
import { IGlobalAppState } from "../state/Store";
import { emptyStoreData } from "../state/reducers/storeReducer";
import { resetStoreItemState } from "./storeItemHelpers";
import { emptyStoreItemData } from "../state/reducers/storeItemReducer";
import { resetProductState } from "./productHelpers";
import { resetServiceState } from "./serviceHelpers";
import { resetBonusVideoState } from "./bonusVideoHelpers";

export const createMockStores = (numberOfStores?: number): IStoreData[] => {
  const createdStores: IStoreData[] = [];
  let totalToCreate: number;

  if (!numberOfStores) {
    totalToCreate = Math.floor(Math.random() * 10);
  } else {
    totalToCreate = numberOfStores;
  }

  for (let i = 0; i < totalToCreate; i++)  {
    const store: IStoreData = {
      _id: faker.random.alphaNumeric(10),
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.recent().toString(),
      images: []
    };
    createdStores.push(store);
  }
  return createdStores;
};

export const createMockStoreImage = (storeId?: string): IStoreImgData => {
  const mockImage: IStoreImgData = {
    _id: faker.random.alphaNumeric(),
    url: faker.internet.url(),
    absolutePath: faker.system.filePath(),
    imagePath: faker.system.directoryPath(),
    fileName: faker.system.fileName(),
    createdAt: faker.date.recent().toString()
  };
  return mockImage;
};

export const clearStoreState = (globalState: IGlobalAppState): void => {
  globalState.storeState = { 
    responseMsg: "",
    loading: false,
    currentStoreData: emptyStoreData(),
    loadedStores: [],
    error: null
  };
};

export const resetStoreState = (): IStoreState => {
  return {
    responseMsg: "",
    loading: false,
    currentStoreData: emptyStoreData(),
    loadedStores: [],
    error: null
  };
};

type SetMockStoreStateOpts = {
  currentStore?: boolean;
  loadedStores?: number;
  storeImages?: number;
}
export const setMockStoreState = ( opts: SetMockStoreStateOpts): IGlobalAppState => {
  const { currentStore, loadedStores, storeImages } = opts;
  let _store: IStoreData | undefined; const _loadedStores: IStoreData[] = []; const _storeImages: IStoreImgData[] = [];
  if (currentStore) {
    _store = {
      _id: faker.random.alphaNumeric(10),
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      images: [],
      createdAt: faker.date.recent().toString()
    }
    if (storeImages) {
      for (let i = 0; i < storeImages; i++) {
        _storeImages.push(createMockStoreImage(_store._id))
      }
      _store.images = _storeImages;
    }
  }

  if (loadedStores) {
    for (let i = 0; i < loadedStores; i++) {
      const _store: IStoreData = {
        _id: faker.random.alphaNumeric(10),
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      images: [],
      createdAt: faker.date.recent().toString()
      };
      _loadedStores.push(_store)
    }
  }

  return {
    storeState: {
      responseMsg: "Ok",
      loading: false,
      currentStoreData: _store ? _store : emptyStoreData(),
      loadedStores: _loadedStores,
      error: null
    },
    storeItemState: resetStoreItemState(),
    productState: resetProductState(),
    serviceState: resetServiceState(),
    bonusVideoState: resetBonusVideoState()
  };
};


