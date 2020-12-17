import mongoose,  { ConnectionOptions } from "mongoose";
import readline from "readline";
import chalk from "chalk";
import config from "../config/config";
// types and models //
import { IService } from "../models/Service";
import { IStore } from "../models/Store";
import { IStoreItem } from "../models/StoreItem";
import { IProduct } from "../models/Product";
import { IStoreImage } from "../models/StoreImage";
import { IProductImage } from "../models/ProductImage";
import { IServiceImage } from "../models/ServiceImage";
import { IStoreItemImage } from "../models/StoreItemImage";

// helpers for seeding //
// admin generation //
import { createAdmins } from "../_tests_/helpers/data_generation/adminsDataGeneration";
// business accounts generation //
import { createBusinessAcccount } from "../_tests_/helpers/data_generation/businessAccontsGeneration";
// user generation //
// store data generation //
import { createStores } from "../_tests_/helpers/data_generation/storesDataGeneration";
import { createStoreImages } from "../_tests_/helpers/data_generation/storeImageDataGeneration"
// store item data generation //
import { createStoreItems } from "../_tests_/helpers/data_generation/storeItemDataGenerations";
import { createStoreItemImages } from "../_tests_/helpers/data_generation/storeItemImageDataGeneration";
// product data generation //
import { createProducts } from "../_tests_/helpers/data_generation/productsDataGeneration";
import { createProductImages } from "../_tests_/helpers/data_generation/productImageDataGeneration";
// service data generation //
import { createServices } from "../_tests_/helpers/data_generation/serviceDataGeneration";
import { createServiceImages } from "../_tests_/helpers/data_generation/serviceImageDataGeneration";
import { IAdministrator } from "../models/Administrator";
import { IBusinessAccount } from "../models/BusinessAccount";



type ModelArr = (IAdministrator[] | IStore[] | IProduct[] | IService[] | IStoreItem[]);
type ImageModelArr = IStoreImage[] | IStoreItemImage[] | IProductImage[] | IServiceImage[];

const { dbSettings } = config;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mongoose.connect(dbSettings.mongoURI, dbSettings.connectionOptions, (err) => {
  if (err) { 
    console.log(err); 
    process.exit(1);
  }
});

const createBusinessAccountsCreation = (aministrators: IAdministrator[])

const askForModelCreation = (modelName: string, businessAccountIds?: string[]) => {
  const models = ["administrator", "store", "product", "service"];

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
        case "Store": {
          const storeModelPromises: Promise<IStore[]>[] = [];
          for (let i = 0; i < businessAccountIds!.length; i++) {
            storeModelPromises.push(createStores(number, businessAccountIds![i]))
          }
          resolve(Promise.all(storeModelPromises));
          break;
        }
        case "Product": {
          const productModelPromises: Promise<IProduct[]>[] = [];
          for (let i = 0; i < businessAccountIds!.length; i++) {
            productModelPromises.push(createProducts(number, businessAccountIds![i]));
          }
          resolve(Promise.all(productModelPromises));
          break;
        }
        case "StoreItem": {
          const storeItemModelPromises: Promise<IStoreItem[]>[] = [];
          for (let i = 0; i < businessAccountIds!.length; i++) {
            storeItemModelPromises.push(createStoreItems(number, businessAccountIds![i]));
          }
          resolve(Promise.all(storeItemModelPromises));
          break;
        }
        case "Service": {
          const serviceModelPromises: Promise<IService[]>[] = [];
          for (let i = 0; i < businessAccountIds!.length; i++) {
            serviceModelPromises.push(createServices(number, businessAccountIds![i]));
          }
          resolve(Promise.all(servicesModelPromises));
          break;
        }
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
          resolve(createStoreImages(number));
          break;
        }
        case "StoreItemImage": {
          resolve(createStoreItemImages(models as IStoreItem[], number));
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
  let createdAdmins: IAdministrator[];
  let createdAdminsWithoutBusAcccount: IAdministrator[];
  let createdBusAcccounts: IBusinessAccount[];
  let createdStores: IStore[]; let storeImages: IStoreImage[];
  let createdProducts: IProduct[]; let productImages: IProductImage[];
  let createdServices: IService[]; let serviceImages: IServiceImage[];

  mongoose.connection.db.dropDatabase()
    .then(() => {
      const dbName = mongoose.connection.db.databaseName;
      console.log(chalk.bgGreen.bold.yellow(`Seeding Database: ${chalk.bgYellow.bold.blue(dbName)}.`));
      return askForModelCreation("Administrator");
    })
    .then((_createdAdmins) => {
      createdAdmins = _createdAdmins as IAdministrator[];
      const createPromises: Promise<IBusinessAccount>[] = [];
      for ( const admin of createdAdmins as IAdministrator[]) {
        createPromises.push(createBusinessAcccount({ admins: [ admin] })); 
      }
      return Promise.all(createPromises);
    })
    .then((_createdBusAcccounts) => {
      const storePromises: Promise<IBusinessAccount>[] = [];
      const busAccountsLength = createdBusAcccounts.length;
      createdBusAcccounts = _createdBusAcccounts;
      console.log(chalk.bgGreen.bold.yellow(`Created: ${chalk.bgYellow.bold.blue(createdAdmins.length)} Administrators`));
      console.log(chalk.bgGreen.bold.yellow(`Created: ${chalk.bgYellow.bold.blue(createdBusAcccounts.length)} BusinessAccounts`));
      console.log(chalk.bgGreen.bold.yellow(`Would you like to create any Administrator models not linked to a BusinessAccount?`));
      return askForModelCreation("Administrator");
    })
    .then((_createdAdminsWithoutBusAcccount) => {
      createdAdminsWithoutBusAcccount = _createdAdminsWithoutBusAcccount as IAdministrator[] | []
      return askForModelCreation("Stores")
    })
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(stores.length)} Stores`));
      createdStores = stores as IStore[];
      // return askForModelCreation("Product");
      return askForImageCreation("StoreImage", createdStores);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} StoreImages`));
      return askForModelCreation("StoreItem");
    })
    .then((createdStoreItems) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdStoreItems.length)} Store Items`));
      return askForImageCreation("StoreItemImage", createdStoreItems);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} StoreItemImages`));
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