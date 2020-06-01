import faker from "faker";
import Service, { IService } from "../../models/Service";
import Store, { IStore } from "../../models/Store";

/**
 * Creates a set number of mock {Store} objects.
 * @param numberOfStores - number of mock {Store} models to create.
 */
export const createStores = (numberOfStores: number): Promise<IStore[]> => {
  const createdStores: Promise<IStore>[] = [];

  for (let i = 0; i < numberOfStores; i++) {
    createdStores. push(Store.create({
      title: faker.lorem.word(),
      description: faker.lorem.paragraphs(3),
      images: []
    }));
  }
  return Promise.all(createdStores);
};

/**
 * Creates a set number of mock {Service} objects.
 * @param numOfServices - number of mock {Service} models to create.
 */
export const createServices = (numOfServices: number): Promise<IService[]> => {
  const createdServices: Promise<IService>[] = [];

  for (let i = 0; i < numOfServices; i++) {
    createdServices.push(Service.create({
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(2),
      price: faker.commerce.price(1, 100),
      images: []
    }));
  }
  return Promise.all(createdServices);
};

