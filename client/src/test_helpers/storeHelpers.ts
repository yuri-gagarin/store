import faker from "faker";
import { IGlobalAppState } from "../state/Store";
import { emptyStoreData } from "../state/reducers/storeReducer";

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

export const clearStoreState = (globalState: IGlobalAppState): IGlobalAppState => {
  return {
    storeState: { 
      responseMsg: "",
      loading: false,
      currentStoreData: emptyStoreData(),
      loadedStores: [],
      error: null
    },
    storeItemState: { ...globalState.storeItemState },
    productState: { ...globalState.productState },
    serviceState: { ...globalState.serviceState },
    bonusVideoState: { ...globalState.bonusVideoState }
  };
};

