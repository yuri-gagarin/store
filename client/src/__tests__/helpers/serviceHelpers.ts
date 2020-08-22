import faker from "faker";

export const createMockServices = (numberOfServices?: number): IServiceData[] => {
  const createdServices: IServiceData[] = [];
  let totalToCreate: number;

  if (!numberOfServices) {
    totalToCreate = Math.floor(Math.random() * 10);
  } else {
    totalToCreate = numberOfServices;
  }

  for (let i = 0; i < totalToCreate; i++)  {
    const service: IServiceData = {
      _id: faker.random.alphaNumeric(10),
      name: faker.lorem.word(),
      price: faker.commerce.price(20, 100),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.recent().toString(),
      images: []
    };
    createdServices.push(service);
  }
  return createdServices;
};

export const createMockServiceImage = (serviceId?: string): IServiceImgData => {
  const mockImage: IServiceImgData = {
    _id: faker.random.alphaNumeric(),
    url: faker.internet.url(),
    absolutePath: faker.system.filePath(),
    imagePath: faker.system.directoryPath(),
    fileName: faker.system.fileName(),
    createdAt: faker.date.recent().toString()
  };
  return mockImage;
};

