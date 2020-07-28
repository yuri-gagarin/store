import fs from "fs";
import path from "path";
import faker from "faker";
import Service, { IService } from "../../models/Service";
import Store, { IStore } from "../../models/Store";
import StoreItem, { IStoreItem } from "../../models/StoreItem";
import Product, { IProduct } from "../../models/Product";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import ServiceImage, { IServiceImage } from "../../models/ServiceImage";
import ProductImage, { IProductImage } from "../../models/ProductImage";
import BonusVideo, { IBonusVideo } from "../../models/BonusVideo";
// data //
import storeItemMockCategories from "./storeItemMockCategories";
import storeItemCategories from "./storeItemMockCategories";

const seedRandomCategories = (categories: string[]): string[] => {
  const returnedCategories: string[] = [];
  const numOfCategories = Math.floor(Math.random() * Math.floor(categories.length));
  for (let i = 0; i < numOfCategories; i++) {
    returnedCategories.push(categories[i]);
  }
  return returnedCategories;
}
/**
 * Creates a set number of mock {BonusVideo} objects.
 * @param numOfVideos - number of mock {BonusVideo} models to create.
 */
export const createBonusVideos = (numOfVideos: number): Promise<IBonusVideo[]> => {
  const createdVideos: Promise<IBonusVideo>[] = [];

  for (let i = 0; i < numOfVideos; i++) {
    createdVideos.push(BonusVideo.create({
      description: faker.lorem.paragraph(),
      youTubeURL: faker.internet.url(),
      vimeoURL: ""
    }));
  }
  return Promise.all(createdVideos);
};

/**
 * Creates a set number of mock {Store} objects.
 * @param numberOfStores - number of mock {Store} models to create.
 */
export const createStores = (numberOfStores: number): Promise<IStore[]> => {
  const createdStores: Promise<IStore>[] = [];

  for (let i = 0; i < numberOfStores; i++) {
    createdStores.push(Store.create({
      title: faker.lorem.word(),
      description: faker.lorem.paragraphs(3),
      images: []
    }));
  }
  return Promise.all(createdStores);
};

/**
 * Creates a specific number of mock {StoreItem} objects.
 * @param numOfStoreItems - Number of mock {StoreItem} objects to create.
 * @param storeId - ObjectID of a {Store} model.
 */
export const createStoreItems = (numOfStoreItems: number, storeId?: string): Promise<IStoreItem[]> => {
  const createdStoreItems: Promise<IStoreItem>[] = [];
  if (!storeId) {
    Store.find({}).then((stores) => {
      for (let i = 0; i < stores.length; i++) {
        for (let j = 0; j < numOfStoreItems; j++) {
          createdStoreItems.push(StoreItem.create({
            storeId: stores[i]._id,
            name: faker.lorem.word(),
            details: faker.lorem.paragraph(),
            description: faker.lorem.paragraphs(2),
            price: faker.commerce.price(1, 100),
            images: [],
            categories: seedRandomCategories(storeItemCategories)
          }));
        }
      }
    })
  }
  for (let i = 0; i < numOfStoreItems; i++) {
    createdStoreItems.push(StoreItem.create({
      storeId: storeId,
      name: faker.lorem.word(),
      details: faker.lorem.paragraph(),
      description: faker.lorem.paragraphs(2),
      price: faker.commerce.price(1, 100),
      images: [],
      categories: [faker.lorem.word(), faker.lorem.word()]
    }));
  }
  return Promise.all(createdStoreItems);
}

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

export const createStoreImage = (imgData: IStoreImage): Promise<IStoreImage>=> {
  let image: IStoreImage;
  return StoreImage.create(imgData)
    .then((img) => {
      image = img;
      return Store.findOneAndUpdate(
        { _id: img.storeId}, 
        { $push: { images: img._id} },
        );
    })
    .then(() => {
      return image;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    })
};
export const createProductImage = (imgData: IProductImage): Promise<IProductImage> => {
  let image: IProductImage;
  return ProductImage.create(imgData)
    .then((img) => {
      image = img;
      return Product.findOneAndUpdate(
        { _id: img.productId },
        { $push: { images: img._id } }
      );
    })
    .then(() => {
      return image;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    })
};
export const createServiceImage = (imgData: IServiceImage): Promise<IServiceImage> => {
  let image: IServiceImage;
  return ServiceImage.create(imgData)
    .then((img) => {
      image = img;
      return Service.findOneAndUpdate(
        { _id: img.serviceId },
        { $push: { images: img._id } }
      );
    })
    .then(() => {
      return image;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    })
};

export const createProductImages = (products: IProduct[], numberOfImages?: number): Promise<IProductImage[]> => {
  const imagePromises: Promise<IProductImage>[] = [];
  const imagesToCreate = numberOfImages ? numberOfImages : Math.ceil(Math.random() * 10);
  const imagePath = path.join("uploads", "product_images");
  const writePath = path.join(path.resolve(), "public", imagePath);
  const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");

  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < imagesToCreate; j++) {
      const imageName = `${i}_${j}_${products[i].name}_test.jpeg`;
      const image = path.join(writePath, imageName);
      try {
        fs.writeFileSync(image, fs.readFileSync(sampleImagePath));
        const newImage = new ProductImage({
          productId: products[i]._id,
          imagePath: imagePath,
          absolutePath: image,
          fileName: imageName,
          url: "/" + imagePath + "/" + imageName
        });
        imagePromises.push(createProductImage(newImage));
  
      } catch (error) {
        console.error(error);
      }
    }
  }
  return Promise.all(imagePromises);
};


export const createServiceImages = (services: IService[], numberOfImages?: number): Promise<IServiceImage[]> => {
  const imagePromises: Promise<IServiceImage>[] = [];
  const imagesToCreate = numberOfImages ? numberOfImages : Math.ceil(Math.random() * 10);
  const imagePath = path.join("uploads", "service_images");
  const writePath = path.join(path.resolve(), "public", imagePath);
  const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");

  for (let i = 0; i < services.length; i++) {
    for (let j = 0; j < imagesToCreate; j++) {
      const imageName = `${i}_${j}_${services[i].name}_test.jpeg`;
      const image = path.join(writePath, imageName);
      try {
        fs.writeFileSync(image, fs.readFileSync(sampleImagePath));
        const newImage = new ServiceImage({
          serviceId: services[i]._id,
          imagePath: imagePath,
          absolutePath: image,
          fileName: imageName,
          url: "/" + imagePath + "/" + imageName
        });
        imagePromises.push(createServiceImage(newImage));
  
      } catch (error) {
        console.error(error);
      }
    }
  }
  return Promise.all(imagePromises);
};

export const createStoreImages = (stores: IStore[], numberOfImages?: number): Promise<IStoreImage[]> => {
  const imagePromises: Promise<IStoreImage>[] = [];
  const imagesToCreate = numberOfImages ? numberOfImages : Math.ceil(Math.random() * 10);
  const imagePath = path.join("uploads", "store_images");
  const writePath = path.join(path.resolve(), "public", imagePath);
  const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");
  
  for (let i = 0; i < stores.length; i++) {
    for (let j = 0; j < imagesToCreate; j++) {
      const imageName = `${i}_${j}_${stores[i].title}_test.jpeg`;
      const image = path.join(writePath, imageName);
      try {
        fs.writeFileSync(image, fs.readFileSync(sampleImagePath));
        const newImage = new StoreImage({
          storeId: stores[i]._id,
          imagePath: imagePath,
          absolutePath: image,
          fileName: imageName,
          url: "/" + imagePath + "/" + imageName
        });
        imagePromises.push(createStoreImage(newImage));
  
      } catch (error) {
        console.error(error);
      }
    }
  }
  return Promise.all(imagePromises);
};