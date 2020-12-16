import faker from "faker"
import { IBusinessAccount } from "../../../models/BusinessAccount";
import Store, { IStore } from "../../../models/Store";
import { StoreData } from "../../../controllers/stores_controller/type_declarations/storesControllerTypes";

export const generateMockStoreData = (numberOfStores: number): StoreData[] => {
  const storeDataArr: StoreData[] = [];
  for (let i = 0; i < numberOfStores; i++) {
    const mockStoreData: StoreData = {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      images: []
    };
    storeDataArr.push(mockStoreData);
  } 
  return storeDataArr;
};

/**
 * Creates a set number of mock {Store} objects.
 * @param numOfStores - Number of stores to create.
 * @param busAccountId - <BusinessAccount> model id to tie the <Store> to.
 * @returns Promise<IStore[]>
 */
export const createStores = (numberOfStores: number, busAccountId: string): Promise<IStore[]> => {
  const createdStores: Promise<IStore>[] = [];

  for (let i = 0; i < numberOfStores; i++) {
    let title: string;

    do {
      title = faker.lorem.word();
    } while (title.length < 4);

    createdStores.push(
      Store.create({
        businessAccountId: busAccountId,
        title: title,
        description: faker.lorem.paragraph(2),
        images: [],
        createdAt: new Date(Date.now()),
        editedAt: new Date(Date.now())
      })
    );
  }
  return Promise.all(createdStores);
};
