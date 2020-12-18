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



type DataModel = IAdministrator | IStore | IProduct | IService | IStoreItem;
type ImageModel = IStoreImage | IStoreItemImage | IProductImage| IServiceImage;

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


const askForModelCreation = async (modelName: string, businessAccounts?: IBusinessAccount[], stores?: IStore[]): Promise<DataModel[]> => {
  const models = ["administrator", "store", "product", "service"];
  let dataModels: DataModel[] = [];
  const question = chalk.bgWhiteBright(chalk.black.bold(
    "Seeding database, type: " + chalk.bgRed.bold.white("exit") + " anytime to exit\n" +
    "How many " + chalk.bgBlue(chalk.bold.white(modelName)) + " would you like to create?:"
  ));

  return new Promise((resolve, reject) => {
    rl.question(question, async (val) => {
      if (val.toLowerCase() === "exit") {
        console.log(chalk.bgYellow(chalk.black("Exiting, Good Bye!")));
        process.exit(0);
      }
      const number = parseInt(val, 10);
      if (isNaN(number)) throw new Error("Not a number");
      
      switch  (modelName) {
        case "Administrator": {
          const administratorModels: IAdministrator[] = await createAdmins(number);
          resolve(administratorModels);
          break;
        }
        case "Store": {
          let storeModels: IStore[] = [];
          for (let i = 0; i < businessAccounts!.length; i++) {
            const stores = await createStores(number, businessAccounts![i]._id);
            storeModels = [ ...storeModels, ...stores ];
          }
          resolve(storeModels);
          break;
        }
        case "StoreItem": {
          let storeItemModels: IStoreItem[] = [];
          for (let i = 0; i < stores!.length; i++) {
            let storeItems = await createStoreItems(number, stores![i]);
            storeItemModels = [ ...storeItemModels, ...storeItems ];
          }
          resolve(storeItemModels);
          break;
        }
        case "Product": {
          let productModels: IProduct[] = [];
          for (let i = 0; i < businessAccounts!.length; i++) {
            let products = await createProducts(number, businessAccounts![i]);
            productModels = [ ...productModels, ...products ];
          }
          resolve(productModels);
          break;
        }
        case "Service": {
          let serviceModels: IService[] = [];
          for (let i = 0; i < businessAccounts!.length; i++) {
            let services = await createServices(number, businessAccounts![i]);
            serviceModels = [ ...serviceModels, ...services ];
          }
          resolve(serviceModels);
          break;
        }
        default: {
          throw new Error("Can't resolve data model");
        }
      }
    });
  });
};

const askForImageCreation = async (modelName: string, models: DataModel[]): Promise<ImageModel[]> => {
  const modelNameArr = modelName.split((/(?=[A-Z])/));
  const imgModelName = modelNameArr.slice(0, (modelNameArr.length - 1)).join();
  let dataModels: ImageModel[] = [];
  return new Promise((resolve, reject) => {
    rl.question(chalk.bold.yellowBright(`How many ${modelName} PER ${imgModelName} would you like to create: `), async (val) => {
      const number = parseInt(val, 10);
      if (isNaN(number)) return [];
  
      switch (modelName) {
        case "StoreImage": {
          let storeImagesArr: IStoreImage[] = [];
          for (const model of models) {
            const storeImages = await createStoreImages(number, model as IStore);
            storeImagesArr = [ ...storeImagesArr, ...storeImages ];
          }
          resolve(storeImagesArr);
          break;
        }
        case "StoreItemImage": {
          let storeItemImagesArr: IStoreItemImage[] = [];
          for (const model of models) {
            const storeItemImages = await createStoreItemImages(number, model as IStoreItem);
            storeItemImagesArr = [ ...storeItemImagesArr, ...storeItemImages ];
          }
          resolve(storeItemImagesArr);
          break;
        }
        case "ProductImage": {
          let productImagesArr: IProductImage[] = [];
          for (const model of models) {
            const productImages = await createProductImages(number, model as IProduct);
            productImagesArr = [ ...productImagesArr, ...productImages ];
          }
          resolve(productImagesArr);
          break;
        }
        case "ServiceImage": {
          let serviceImagesArr: IServiceImage[] = [];
          for (const model of models) {
            const serviceImages = await createServiceImages(number, model as IService);
            serviceImagesArr = [ ...serviceImagesArr, ...serviceImages ];
          }
          resolve(serviceImagesArr);
          break;
        }
        default: {
          throw new Error()
        }
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
      const busAccountsLength = _createdBusAcccounts.length;
      createdBusAcccounts = _createdBusAcccounts;
      console.log(chalk.bgGreen.bold.yellow(`Created: ${chalk.bgYellow.bold.blue(createdAdmins.length)} Administrators`));
      console.log(chalk.bgGreen.bold.yellow(`Created: ${chalk.bgYellow.bold.blue(createdBusAcccounts.length)} BusinessAccounts`));
      console.log(chalk.bgGreen.bold.yellow(`Would you like to create any Administrator models not linked to a BusinessAccount?`));
      return askForModelCreation("Administrator");
    })
    .then((_createdAdminsWithoutBusAcccount) => {
      createdAdminsWithoutBusAcccount = _createdAdminsWithoutBusAcccount as IAdministrator[] | []
      return askForModelCreation("Store", createdBusAcccounts)
    })
    .then((_createdStores) => {
      createdStores = _createdStores as IStore[];
      return askForImageCreation("StoreImage", createdStores);
    })
    .then((_createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(_createdImages.length)} StoreImages`));
      return askForModelCreation("StoreItem", undefined, createdStores);
    })
    .then((createdStoreItems) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdStoreItems.length)} Store Items`));
      return askForImageCreation("StoreItemImage", createdStoreItems);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} StoreItemImages`));
      return askForModelCreation("Service", createdBusAcccounts);
    })
    .then((services) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(services.length)} Services`));
      return askForImageCreation("ServiceImage", services);
    })
    .then((createdImages) => {
      console.log(chalk.bold.blue(`Created ${chalk.whiteBright(createdImages.length)} ServiceImages`));
      return askForModelCreation("Product", createdBusAcccounts);
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