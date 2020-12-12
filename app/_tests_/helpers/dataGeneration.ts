import fs from "fs";
import path from "path";
import faker from "faker";
import bcrypt from "bcrypt";
import Service, { IService } from "../../models/Service";
import Store, { IStore } from "../../models/Store";
import StoreItem, { IStoreItem } from "../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../models/StoreItemImage";
import Product, { IProduct } from "../../models/Product";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import ServiceImage, { IServiceImage } from "../../models/ServiceImage";
import ProductImage, { IProductImage } from "../../models/ProductImage";
import BonusVideo, { IBonusVideo } from "../../models/BonusVideo";
import Administrator, { IAdministrator } from "../../models/Administrator";
// data //
import storeItemCategories from "./storeItemMockCategories";
import { AdminData } from "../../controllers/admins_controller/type_declarations/adminsControllerTypes";
import User, { IUser } from "../../models/User";
import { UserData } from "../../controllers/users_controller/type_declarations/usersControllerTypes";
import { IBusinessAccount } from "../../models/BusinessAccount";
import { ProductData } from "../../controllers/products_controller/type_declarations/productsControllerTypes";
/*
  TODO 
  this module is getting extremely crowded with multiple data generators 
  split into multiple modules based on a model which is related to a data generator function
*/
const  ensureDirectoryExistence = (filePath: string): void => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  fs.mkdirSync(dirname);
}

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


const createStoreItem = (store: IStore): Promise<IStoreItem> => {
  let createdItem: IStoreItem;
  let newItem = {
      storeId: store._id,
      name: faker.lorem.word(),
      storeName: store?.title,
      details: faker.lorem.paragraph(),
      description: faker.lorem.paragraphs(2),
      price: faker.commerce.price(1, 100),
      images: [],
      categories: [faker.lorem.word(), faker.lorem.word()]
  };
  return StoreItem.create(newItem)
    .then((storeItem) => {
      createdItem  = storeItem;
      return Store.findByIdAndUpdate({ _id: store._id }, { $inc: { numOfItems: 1} })
    })
    .then((store) => {
      return createdItem;
    })  
    .catch((error) => {
      throw error;
    })
}
type CreateStoreItemArg = number | "random"
/**
 * Creates a specific number of mock {StoreItem} objects.
 * @param numOfStoreItems - Number of mock {StoreItem} objects to create.
 * @param storeId - ObjectID of a {Store} model.
 */
export const createStoreItems = (numOfStoreItems: CreateStoreItemArg, storeId?: string): Promise<IStoreItem[]> => {
  let numOfItems: number;
  if (numOfStoreItems === "random") {
    numOfItems = Math.ceil(Math.random() * 10);
  } else {
    numOfItems = numOfStoreItems;
  }
  const createdStoreItems: Promise<IStoreItem>[] = [];
  if (!storeId) {
    return Store.find({})
      .then((stores) => {
      for (let i = 0; i < stores.length; i++) {
        for (let j = 0; j < numOfItems; j++) {
          createdStoreItems.push(createStoreItem(stores[i]))
        }
      }
    })
    .then(() => {
      return Promise.all(createdStoreItems);
    })
  }
  else {
    return Store.findOne({ _id: storeId })
      .then((store) => {
        for (let i = 0; i < numOfItems; i++) {
          createdStoreItems.push(createStoreItem(store!))
        }
        return Promise.all(createdStoreItems);
      })
      .catch((err) => {
        throw err;
      });
  }
}







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

export const createStoreItemImage = (imgData: IStoreItemImage): Promise<IStoreItemImage> => {
  let image: IStoreItemImage;
  return StoreItemImage.create(imgData)
    .then((img) => {
      image = img;
      return StoreItem.findOneAndUpdate(
        { _id: img.storeItemId },
        { $push: { images: img._id} }
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



/**
 * 
 * @param services - Array of Service objects.
 * @param numberOfImages - Number of images per Services to create (optional)
 */
export const createServiceImages = (services: IService[], numberOfImages?: number): Promise<IServiceImage[]> => {
  const imagePromises: Promise<IServiceImage>[] = [];
  const imagesToCreate = numberOfImages ? numberOfImages : Math.ceil(Math.random() * 10);
  // write path //
  const writeDir = path.join(path.resolve(), "public", "uploads", "service_images");
  // samle test image to upload //
  const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");

  for (let i = 0; i < services.length; i++) {
    // check if path exists first //
    // images will go into {writeDir + service._id}
    const subDir = services[i]._id.toString();
    const finalDir = path.join(writeDir, subDir);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    for (let j = 0; j < imagesToCreate; j++) {
      const imageName = `${i}_${j}_${services[i].name}_test.jpeg`;
      const absolutePath = path.join(finalDir, imageName);
      try {
        fs.writeFileSync(absolutePath, fs.readFileSync(sampleImagePath));
        const newImage = new ServiceImage({
          serviceId: services[i]._id,
          imagePath: "/uploads/service_images/" + subDir + "/",
          absolutePath: absolutePath,
          fileName: imageName,
          url: "/uploads/service_images/" + subDir + "/" + imageName
        });
        imagePromises.push(createServiceImage(newImage));
  
      } catch (error) {
        console.error(error);
      }
    }
  }
  return Promise.all(imagePromises);
};



export const createStoreItemImages = (storeItems: IStoreItem[], numberofImages?: number): Promise<IStoreItemImage[]> => {
  const imagePromises: Promise<IStoreItemImage>[] = [];
  const imagesToCreate = numberofImages ? numberofImages : Math.ceil(Math.random() * 10);
  // write path //
  const writeDir = path.join(path.resolve(), "public", "uploads", "store_item_images");
  // samle test image to upload //
  const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");

  for (let i = 0; i < storeItems.length; i++) {
    // check if path exists first //
    // images will go into {writeDir + service._id}
    const subDir = storeItems[i]._id.toString();
    const finalDir = path.join(writeDir, subDir);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    for (let j = 0; j < imagesToCreate; j++) {
      const imageName = `${i}_${j}_${storeItems[i].name}_test.jpeg`;
      const absolutePath = path.join(finalDir, imageName);
      try {
        fs.writeFileSync(absolutePath, fs.readFileSync(sampleImagePath));
        const newImage = new StoreItemImage({
          storeItemId: storeItems[i]._id,
          imagePath: "/uploads/store_item_images/" + subDir + "/",
          absolutePath: absolutePath,
          fileName: imageName,
          url: "/uploads/store_item_images/" + subDir + "/" + imageName
        });
        imagePromises.push(createStoreItemImage(newImage));
  
      } catch (error) {
        console.error(error);
      }
    }
  }
  return Promise.all(imagePromises);
};


export const generateMockAdminData = (): AdminData => {
  const newAdmin: AdminData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    handle: faker.internet.userName(),
    email: faker.internet.email(),
    password: "password",
    passwordConfirm: "password",
  };
  return newAdmin;
};


export const createAdmins = async (number: number): Promise<IAdministrator[]> => {
  const createdAdminPromises: Promise<IAdministrator>[] = [];
  for (let i = 0; i < number; i++) {
    const adminData: AdminData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      handle: faker.internet.userName(),
      email: faker.internet.email(),
      password: "password",
      passwordConfirm: "password"
    }
    const passwordHash = await new Promise<string>((res, rej) => {
      bcrypt.hash(adminData.password, 10, (err, passHash) => {
        res(passHash)
      })
    })
    createdAdminPromises.push(
      Administrator.create({
        ...adminData,
        password: passwordHash
      })
    );
  }
  return Promise.all(createdAdminPromises);
};

// User model generation //
export const generateMockUserData = (): UserData => {
  const newAdmin: UserData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    handle: faker.internet.userName(),
    email: faker.internet.email(),
    password: "password",
    passwordConfirm: "password",
  };
  return newAdmin;
};
export const createUsers = async (number: number): Promise<IUser[]> => {
  const createdUserPromises: Promise<IUser>[] = [];
  for (let i = 0; i < number; i ++) {
    const userData = generateMockUserData();
    const passHash = await new Promise<string>((res) => {
      bcrypt.hash(userData.password, 10, (err, passHash) => {
        res(passHash);
      });
    });
    createdUserPromises.push(
      User.create({ ...userData, password: passHash })
    );
  }
  return Promise.all(createdUserPromises);

}