import mongoose,  { ConnectionOptions } from "mongoose";
import readline from "readline";
import chalk from "chalk";
import config from "../config/config";
// types and models //
import { IService } from "../models/Service";
import { IStore } from "../models/Store";
import { IProduct } from "../models/Product";
import { IStoreImage } from "../models/StoreImage";
import { IProductImage } from "../models/ProductImage";
import { IServiceImage } from "../models/ServiceImage";

// helpers for seeding //
import { 
  createStores, createProducts, createServices,
   createStoreImages, createProductImages, createServiceImages 
} from "../_tests_/helpers/dataGeneration";


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
});

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
      const number = parseInt(val, 10);
      if (isNaN(number)) throw new Error("Not a number");
      
      switch (modelName) {
        case "Store": 
          resolve(createStores(number));
          break;
        case "Product": 
          resolve(createProducts(number));
          break;
        case "Service": 
          resolve(createServices(number));
          break;
        default: reject(new Error("Can't tesolve model"));
      }
    });
  });
};

const askForImageCreation = (modelName: string, models: ModelArr) => {
  return new Promise<ImageModelArr>((resolve, reject) => {
    rl.question(chalk.bold.yellowBright(`How many ${modelName} PER Store would you like to create: `), (val) => {
      const number = parseInt(val, 10);
      if (isNaN(number)) return [];
      
      switch (modelName) {
        case "StoreImage": {
          resolve(createStoreImages(models as IStore[], number));
          break;
        }
        case "ProductImage": {
          resolve(createProductImages(models as IProduct[], number));
          break;
        }
        case "ServiceImage": {
          resolve(createServiceImages(models as IService[], number));
          break;
        }
        default: reject(new Error("Can't resolve Image model"));
      }
    });
  });
};

mongoose.connection.once("open", () => {
  let createdStores: IStore[]; let storeImages: IStoreImage[];
  let createdProducts: IProduct[]; let productImages: IProductImage[];
  let createdServices: IService[]; let serviceImages: IServiceImage[];

  mongoose.connection.db.dropDatabase()
    .then(() => {
      return askForModelCreation("Store");
    })
    .then((stores) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(stores.length)} Stores`));
      createdStores = stores as IStore[];
      return askForModelCreation("Product");
    })
    .then((products) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(products.length)} Products`));
      createdProducts = products as IProduct[];
      return askForModelCreation("Service");
    })
    .then((services) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(services.length)} Services`));
      createdServices = services as IService[];
      return askForImageCreation("StoreImage", createdStores);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} StoreImages`));
      storeImages = createdImages as IStoreImage[];
      return askForImageCreation("ProductImage", createdProducts);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} ProductImages`));
      productImages = createdImages as IProductImage[];
      return askForImageCreation("ServiceImage", createdServices);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} ServiceImages`));
      serviceImages = createdImages as IServiceImage[];
      return true;
    })
    .then(() => {
      console.log(chalk.bold.yellowBright("Seeding finished"));
      mongoose.connection.close((err) => {
        if (err) { 
          console.error(err);
          process.exit(1);
        } else {
          process.exit(0);
        }
      });
    })
    .catch((err) => {
      console.error("An error occured");
      console.error(err);
      process.exit(1);
    });
  
});