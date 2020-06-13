import mongoose,  { ConnectionOptions, modelNames } from "mongoose";
import readline from "readline";
import config from "../config/config";
// types and models //
import { IService } from "../models/Service";
import { IStore } from "../models/Store";
import { IProduct } from "../models/Product";
import { IStoreImage } from "../models/StoreImage";
import { IProductImage } from "../models/ProductImage";
import { IServiceImage } from "../models/ServiceImage";

// helpers for seeding //
import { createStores, createProducts, createServices, createStoreImages } from "../_tests_/helpers/dataGeneration";


type ModelArr = IStore[] | IProduct[] | IService[];
type ImageModelArr = IStoreImage[] | IProductImage[] | IServiceImage[];

const { dbSettings } = config;
const dbOptions: ConnectionOptions = {
  user: dbSettings.username,
  pass: dbSettings.password,
  useNewUrlParser: dbSettings.useNewUrlParser,
  useFindAndModify: dbSettings.useFindAndModify,
  useUnifiedTopology: dbSettings.useUnifiedTopology
};
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

mongoose.connect(dbSettings.mongoURI, dbOptions, (err) => {
  if (err) { 
    console.log(err); 
    process.exit(1);
  }
});

const askForModelCreation = (modelName: string) => {
  const models = ["store", "product", "service"];

  return new Promise<ModelArr>((resolve, reject) => {
    rl.question(`How many ${modelName} would you like to create: `, (val) => {
      let number = parseInt(val, 10);
      if (isNaN(number)) throw new Error("Not a number");
      
      switch (modelName) {
        case "Store": 
          resolve(createStores(number))
        case "Product": 
          resolve(createProducts(number));
        case "Service": 
          resolve(createServices(number));
        default: reject(new Error("Can't tesolve model"));
      }
    });
  });
};

const askForImageCreation = (modelName: string, models: IStore[]) => {
  return new Promise<ImageModelArr>((resolve, reject) => {
    rl.question(`How many ${modelName} PER Store would you like to create: `, (val) => {
      let number = parseInt(val, 10);
      if (isNaN(number)) return [];
      
      switch (modelName) {
        case "StoreImage": {
          resolve(createStoreImages(models, number));
        }
        default: reject(new Error("Can't resolve Image model"));
      }
    });
  });
};

mongoose.connection.once("open", () => {
  let createdStores: IStore[]; let storeImages: IStoreImage[];
  mongoose.connection.db.dropDatabase()
    .then(() => {
      return askForModelCreation("Store")
    })
    .then((stores) => {
      console.log(`Created ${stores.length} Stores`);
      createdStores = stores as IStore[];
      return askForModelCreation("Product");
    })
    .then((products) => {
      console.log(`Created ${products.length} Products`);
      return askForModelCreation("Service");
    })
    .then((services) => {
      console.log(`Created ${services.length} Services`);
      return true;
    })
    .then(() => {
      return askForImageCreation("StoreImage", createdStores);
    })
    .then((createdImages) => {
      storeImages = createdImages as IStoreImage[]
      return true;
    })
    .then(() => {
      console.log("Seeding finished");
      mongoose.connection.close((err) => {
        if (err) { 
          console.error(err);
          process.exit(1);
        } else {
          process.exit(0);
        }
      })
    })
    .catch((err) => {
      console.error("An error occured");
      console.error(err);
      process.exit(1);
    })
  
})