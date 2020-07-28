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
  createStores, createStoreItems, createProducts, createServices,
   createStoreImages, createProductImages, createServiceImages 
} from "../_tests_/helpers/dataGeneration";
import { IStoreItem } from "../models/StoreItem";


type ModelArr = IStore[] | IProduct[] | IService[] | IStoreItem[];
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
    const question = chalk.bgWhiteBright(chalk.black.bold(
      "Seeding database, type: " + chalk.bgRed.bold.white("exit") + " anytime to exit\n" +
      "How many " + chalk.bgBlue(chalk.bold.white(modelName)) + " would you like to create?:"
    ));

    rl.question(question, (val) => {
      if (val.toLowerCase() === "exit") {
        console.log(chalk.bgYellow(chalk.black("Exiting, Good Bye!")));
        process.exit(0);
      }
      const number = parseInt(val, 10);
      if (isNaN(number)) throw new Error("Not a number");
      
      switch (modelName) {
        case "Store": 
          resolve(createStores(number));
          break;
        case "Product": 
          resolve(createProducts(number));
          break;
        case "StoreItem": 
          resolve(createStoreItems(number));
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
      const dbName = mongoose.connection.db.databaseName;
      console.log(chalk.bgGreen.bold.yellow(`Seeding Database: ${chalk.bgYellow.bold.blue(dbName)}.`));
      return askForModelCreation("Store");
    })
    .then((stores) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(stores.length)} Stores`));
      createdStores = stores as IStore[];
      // return askForModelCreation("Product");
      return askForImageCreation("StoreImage", createdStores);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} StoreImages`));
      return askForModelCreation("Service");
    })
    .then((services) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(services.length)} Services`));
      return askForImageCreation("ServiceImage", services);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} ServiceImages`));
      return askForModelCreation("Product");
    })
    .then((products) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(products.length)} Products`));
      return askForImageCreation("ProductImage", products);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} ProductImages`));
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