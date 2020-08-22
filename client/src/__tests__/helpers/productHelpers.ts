import faker from "faker";

export const createMockProducts = (numberOfProducts?: number): IProductData[] => {
  const createdProducts: IProductData[] = [];
  let totalToCreate: number;

  if (!numberOfProducts) {
    totalToCreate = Math.floor(Math.random() * 10);
  } else {
    totalToCreate = numberOfProducts;
  }

  for (let i = 0; i < totalToCreate; i++)  {
    const product: IProductData  = {
      _id: faker.random.alphaNumeric(10),
      name: faker.lorem.word(),
      price: faker.commerce.price(20, 100),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraphs(2),
      createdAt: faker.date.recent().toString(),
      images: []
    };
    createdProducts.push(product);
  }
  return createdProducts;
};

export const createMockProductImage = (productId?: string): IProductImgData => {
  const mockImage: IProductImgData = {
    _id: faker.random.alphaNumeric(),
    url: faker.internet.url(),
    absolutePath: faker.system.filePath(),
    imagePath: faker.system.directoryPath(),
    fileName: faker.system.fileName(),
    createdAt: faker.date.recent().toString()
  };
  return mockImage;
};

