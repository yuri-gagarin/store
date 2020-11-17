import faker from "faker";
import { IGlobalAppState } from "../state/Store";
import { emptyStoreItemData } from "../state/reducers/storeItemReducer";
import { resetStoreState } from "./storeHelpers";
import { resetProductState } from "./productHelpers";
import { resetServiceState }  from "./serviceHelpers";
import { resetBonusVideoState } from "./bonusVideoHelpers";

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
    _id: faker.random.alphaNumeric(10),
    url: faker.internet.url(),
    absolutePath: faker.system.filePath(),
    imagePath: faker.system.directoryPath(),
    fileName: faker.system.fileName(),
    createdAt: faker.date.recent().toString()
  };
  return mockImage;
};

export const clearStoreItemState = (globalState: IGlobalAppState): void => {
  globalState.storeItemState = {
    responseMsg: "",
    loading: false,
    numberOfItems: 0,
    currentStoreItemData: emptyStoreItemData(),
    loadedStoreItems: [],
    storeItemFormOpen: false,
    error: null
  };
};

export const resetStoreItemState = (): IStoreItemState => {
  return {
    responseMsg: "",
    loading: false,
    numberOfItems: 0,
    currentStoreItemData: emptyStoreItemData(),
    loadedStoreItems: [],
    storeItemFormOpen: false,
    error: null
  };
};

type SetMockStoreItemStateOpts = {
  currentStoreItem?: boolean;
  loadedStoreItems?: number;
  storeItemImages?: number;
}
export const setMockStoreItemState = ( opts: SetMockStoreItemStateOpts): IGlobalAppState => {
  const { currentStoreItem, loadedStoreItems, storeItemImages } = opts;
  let _storeItem: IStoreItemData | undefined; const _loadedStoreItems: IStoreItemData[] = []; const _storeItemImages: IStoreItemImgData[] = [];
  if (currentStoreItem) {
    _storeItem = {
      _id: faker.random.alphaNumeric(10),
      storeId: faker.random.alphaNumeric(10),
      storeName: faker.lorem.word(),
      name: faker.lorem.word(),
      price: faker.commerce.price(10, 100),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraphs(2),
      categories: ["mock", "new"],
      images: [],
      createdAt: faker.date.recent().toString()
    }
    if (storeItemImages) {
      for (let i = 0; i < storeItemImages; i++) {
        _storeItemImages.push(createMockStoreItemImage(_storeItem._id))
      }
      _storeItem.images = _storeItemImages;
    }
  }

  if (loadedStoreItems) {
    for (let i = 0; i < loadedStoreItems; i++) {
      const _storeItem: IStoreItemData = {
        _id: faker.random.alphaNumeric(10),
        storeId: faker.random.alphaNumeric(10),
        storeName: faker.lorem.word(),
        name: faker.lorem.word(),
        price: faker.commerce.price(10, 100),
        description: faker.lorem.paragraph(),
        details: faker.lorem.paragraphs(2),
        categories: ["mock", "new"],
        images: [],
        createdAt: faker.date.recent().toString()
      };
      _loadedStoreItems.push(_storeItem);
    }
  }

  return {
    storeState: resetStoreState(),
    storeItemState: {
      responseMsg: "Ok",
      loading: false,
      numberOfItems: 10,
      currentStoreItemData: _storeItem ? _storeItem: emptyStoreItemData(),
      loadedStoreItems: _loadedStoreItems,
      storeItemFormOpen: false,
      error: null
    },
    productState: resetProductState(),
    serviceState: resetServiceState(),
    bonusVideoState: resetBonusVideoState()
  };
};