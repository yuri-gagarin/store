import faker from "faker"
import { IBusinessAccount } from "../../../models/BusinessAccount";
import Store, { IStore } from "../../../models/Store";

/**
 * Creates a set number of mock {Store} objects.
 * @param numOfStores - Number of stores to create.
 * @param busAccount - BusinessAccount model to tie the Store to.
 * @returns Promise<IStore[]>
 */
export const createStores = (numberOfStores: number, busAccount: IBusinessAccount): Promise<IStore[]> => {
  const createdStores: Promise<IStore>[] = [];

  for (let i = 0; i < numberOfStores; i++) {
    createdStores.push(
      Store.create({
        businessAccountId: busAccount._id,
        title: faker.lorem.word(),
        description: faker.lorem.paragraphs(3),
        images: [],
        createdAt: new Date(Date.now()),
        editedAt: new Date(Date.now())
      })
    );
  }
  return Promise.all(createdStores);
};
