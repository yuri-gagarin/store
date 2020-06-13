import fs from "fs";
import path from "path";
import faker from "faker";
import Service, { IService } from "../../models/Service";
import Store, { IStore } from "../../models/Store";
import Product, { IProduct } from "../../models/Product";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import ServiceImage, { IServiceImage } from "../../models/ServiceImage";
import ProductImage, { IProductImage } from "../../models/ProductImage";

type AnyModel = IService | IStore | IProduct;
type AnyImage = IStoreImage | IServiceImage | IProductImage;
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

/**
 * Creates a set number of mock {Product} objects.
 * @param numOfProducts 
 */
export const createProducts = (numOfProducts: number): Promise<IProduct[]> => {
  const createdProducts: Promise<IProduct>[] = [];

  for (let i = 0; i < numOfProducts; i++) {
    createdProducts.push(Product.create({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraphs(3),
      price: faker.commerce.price(1, 100),
      images: []
    }));
  }
  return Promise.all(createdProducts);
};

export const createStoreImage = (imgData: AnyImage): Promise<IStoreImage> => {
  return StoreImage.create({
    ...imgData
  });
};
export const createProductImage = (imgData: AnyImage): Promise<IProductImage> => {
  return ProductImage.create({
    ...imgData
  });
};
export const createServiceImage = (imgData: AnyImage): Promise<IServiceImage> => {
  return ServiceImage.create({
    ...imgData
  });
};
 
/** 
 * Creates a set number of images and uploads them
 * @param models
 */
export const createImages = (modelName: string, models?: AnyModel[], numberOfImages?: number) => {
    const imagePromises: Promise<AnyImage>[] = []
    const imagesToCreate = numberOfImages ? numberOfImages : Math.ceil(Math.random() * 10);
    const imageDirectory = modelName.toLowerCase() + "_" + "images";
    const imagePath = path.join(path.resolve(), "public", "uploads", imageDirectory)
    const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");
    for (let i = 0; i < models.length; i++) {
      const image = imagePath + "/" + i.toString() + "_" + "test.jpeg"
      try {
        const buffer = fs.readFileSync(sampleImagePath);
        fs.writeFileSync(image, buffer);
        const imageData: AnyImage = {
          url: "",
          absolutePath: image,
          imagePath: imagePath
        }
        switch (modelName.toLowerCase()) {
          case "store": {
            imagePromises.push(createStoreImage(imageData));
            break;
          }
          case "product": {
            imagePromises.push(createProductImage(imageData));
            break;
          }
          case "service": {
            imagePromises.push(createServiceImage(imageData));
          }
        }
      } catch (err) {
        console.error(err);
        return;
      }
      
    }
    
  }
