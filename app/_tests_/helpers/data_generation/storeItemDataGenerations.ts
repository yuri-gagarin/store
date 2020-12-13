import faker from "faker";
// models and model interfaces //
import Store, { IStore } from "../../../models/Store";
import StoreItem, { IStoreItem } from "../../../models/StoreItem";
// additional types and interfaces //
import { StoreItemData } from "../../../controllers/store_items_controller/type_declarations/storeItemsControllerTypes";
import { IBusinessAccount } from "../../../models/BusinessAccount";

const storeItemCategories =  [
  "sports",
  "childrens",
  "outdoors",
  "winter",
  "summer",
  "spring",
  "school",
  "furniture",
  "home",
  "office"
];

/**
 * Generates random categories for a <StoreItem> model.
 * @param storeItemCategories - a <string[]> to grab random categories from.
 * @returns <string[]> of random categories for a <StoreItem> object.
 */
const returnRandomStoreItemCategories = (storeItemCategories: string[]): string[] => {
  let arrToPickFrom = [ ...storeItemCategories ];
  let arrOfPicks: string[] = []
  const numfoFcategoriesToPick = Math.floor(Math.random() * 10);
  for (let i = 0; i < numfoFcategoriesToPick; i++) {
    const index = Math.floor(Math.random() * arrToPickFrom.length);
    arrOfPicks.push(...arrToPickFrom.splice(index, 1));
  }
  return arrOfPicks;
}

/**
 * Generates mock data for <StoreItem> models.
 * @param numtoGenerate - Number of StoreItemData objects to generate.
 * @param storeId - <Store> model _id to tie the <StoreItem> model to.
 * @returns <StoreItemData[]> - An array of <StoreItem> data objects.
 */
const generateMockStoreItemsData = (numtoGenerate: number, storeId: string): StoreItemData[] => {
  const mockStoreItems: StoreItemData[] = [];
  for (let i = 0; i < numtoGenerate; i++) {
    // pick random catagories //
    const mockStoreItemData: StoreItemData = {
      storeId: storeId,
      name: faker.commerce.product(),
      price: faker.commerce.price(10, 100),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraph(),
      categories: returnRandomStoreItemCategories(storeItemCategories)
    };
    mockStoreItems.push(mockStoreItemData);
  }
  return mockStoreItems;
};

/**
 * Creates a <StoreItem> model and updates its correspondind <Store> model.
 * @param store - <IStore> object _id.
 * @param businessAccount - <IBusinessAccount> object )id.
 * @returns A <Promise<IStoreItem>> resolving to a <IStoreItem> object.
 */
const createStoreItem = (storeId: string, businessAccountId: string): Promise<IStoreItem> => {
  let createdItem: IStoreItem;
  const newItem: StoreItemData = generateMockStoreItemsData(1, storeId)[0];

  return ( 
    StoreItem.create(
      { 
      ...newItem,
      businessAccountId: businessAccountId
      }
    )
  )
  .then((storeItem) => {
    createdItem  = storeItem;
    return Store.findByIdAndUpdate({ _id: storeId }, { $inc: { numOfItems: 1} })
  })
  .then((_) => {
    return createdItem;
  })  
  .catch((error) => {
    throw error;
  })
};

type CreateStoreItemArg = number | "random"
/**
 * Creates a specific number of <StoreItem> models in the database.
 * @param numOfStoreItems - Number of <StoreItem> models to create.
 * @param storeId - <IStore> object _id.
 * @param businessAccountId - <IBusinessAccount> object _id.
 * @returns <Promise<IStoreItem[]>> resolving to a <IStoreItem[]>.
 */
export const createStoreItems = (numOfStoreItems: CreateStoreItemArg, storeId: string, businessAccountId: string): Promise<IStoreItem[]> => {
  const createdStoreItems: Promise<IStoreItem>[] = [];

  let numOfItems: number;

  if (numOfStoreItems === "random") {
    numOfItems = Math.ceil(Math.random() * 10);
  } else {
    numOfItems = numOfStoreItems;
  }

  for (let i = 0; i < numOfStoreItems; i++) {
    createdStoreItems.push(createStoreItem(storeId, businessAccountId));
  }

  return Promise.all(createdStoreItems);
};