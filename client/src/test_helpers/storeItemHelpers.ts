import faker from "faker";
import { IGlobalAppState } from "../state/Store";
import { emptyStoreItemData } from "../state/reducers/storeItemReducer";

export const seedRandomCategories = (howMany?: number): string[] => {
  const numOfCategories = howMany ? howMany : Math.floor(Math.random() * 10);
  const categories: string[] = [];
  for (let i = 0; i < numOfCategories; i++) {
    categories.push(faker.commerce.department());
  }
  return categories;
}
export const createMockStoreItems = (numberOfStoreItems?: number): IStoreItemData[] => {
  const createdStoreItems: IStoreItemData[] = [];
  let totalToCreate: number;

  if (!numberOfStoreItems) {
    totalToCreate = Math.floor(Math.random() * 10);
  } else {
    totalToCreate = numberOfStoreItems;
  }

  for (let i = 0; i < totalToCreate; i++)  {
    const storeItem: IStoreItemData = {
      _id: faker.random.alphaNumeric(10),
      storeId: faker.random.alphaNumeric(10),
      storeName: faker.lorem.word(),
      name: faker.lorem.word(),
      price: faker.commerce.price(20, 100),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraphs(2),
      categories: seedRandomCategories(),
      createdAt: faker.date.recent().toString(),
      images: []
    };
    createdStoreItems.push(storeItem);
  }
  return createdStoreItems;
};

export const createMockStoreItemImage = (storeItemId?: string): IStoreItemImgData => {
  const mockImage: IStoreItemImgData = {
    _id: faker.random.alphaNumeric(),
    url: faker.internet.url(),
    absolutePath: faker.system.filePath(),
    imagePath: faker.system.directoryPath(),
    fileName: faker.system.fileName(),
    createdAt: faker.date.recent().toString()
  };
  return mockImage;
};

export const clearStoreItemState = (globalState: IGlobalAppState): IGlobalAppState => {
  return {
    storeState: { ...globalState.storeState },
    storeItemState: {
      responseMsg: "",
      loading: false,
      numberOfItems: 0,
      currentStoreItemData: emptyStoreItemData(),
      loadedStoreItems: [],
      error: null
    },
    productState: { ...globalState.productState },
    serviceState: { ...globalState.serviceState },
    bonusVideoState: { ...globalState.bonusVideoState }
  };
};
