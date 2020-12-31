import path from "path";
import fs from "fs";
import { Types } from "mongoose";
import { setupDB } from "../../../helpers/dbHelpers";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import BusinessAccount, { IBusinessAccount } from "../../../../models/BusinessAccount";
import { IStoreItem } from "../../../../models/StoreItem";
// helpers and data generating methods //
import { createAdmins } from "../../../helpers/data_generation/adminsDataGeneration";
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";
import { createStores } from "../../../helpers/data_generation/storesDataGeneration";
import { createStoreImages } from "../../../helpers/data_generation/storeImageDataGeneration";
import { IStoreImage } from "../../../../models/StoreImage";
import { createStoreItems } from "../../../helpers/data_generation/storeItemDataGenerations";
import { createStoreItemImages } from "../../../helpers/data_generation/storeItemImageDataGeneration";
import { IStoreItemImage } from "../../../../models/StoreItemImage";
import { createProducts } from "../../../helpers/data_generation/productsDataGeneration";
import { createProductImages } from "../../../helpers/data_generation/productImageDataGeneration";
import { IProductImage } from "../../../../models/ProductImage";
import { createServices } from "../../../helpers/data_generation/serviceDataGeneration";
import { IServiceImage } from "../../../../models/ServiceImage";
import { createServiceImages } from "../../../helpers/data_generation/serviceImageDataGeneration";
import { IStore } from "../../../../models/Store";
import { IService } from "../../../../models/Service";
import { IProduct } from "../../../../models/Product";

type SetupBusinessAcctContTestRes = {
  admins: {
    firstAdmin: IAdministrator,
    secondAdmin: IAdministrator,
    thirdAdmin: IAdministrator,  
    fourthAdmin: IAdministrator
  },
  businessAccounts: {
    firstAdminsBusinessAccount: IBusinessAccount
    secondAdminsBusinessAccount: IBusinessAccount
  }
};

export const setupBusinessAccountControllerTests = (): Promise<SetupBusinessAcctContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator, fourthAdmin: IAdministrator;
  let firstAdminsBusinessAccount: IBusinessAccount, secondAdminsBusinessAccount: IBusinessAccount, thirdAdminsBusinessAccount: IBusinessAccount;

  return setupDB()
    .then(() => {
      return createAdmins(4);
    }) 
    .then((adminsArr) => {
      [ firstAdmin, secondAdmin, thirdAdmin, fourthAdmin ] = adminsArr;
      return Promise.all([
        createBusinessAcccount({ admins: [ firstAdmin ] }),
        createBusinessAcccount({ admins: [ secondAdmin ] })
      ]);
    })
    .then((busAccountArr) => {
      [ firstAdminsBusinessAccount, secondAdminsBusinessAccount ] = busAccountArr;
      
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminsBusinessAccount._id } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminsBusinessAccount._id } }, { new: true }),
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      return {
        admins: {
          firstAdmin,
          secondAdmin,
          thirdAdmin,
          fourthAdmin
        },
        businessAccounts: {
          firstAdminsBusinessAccount,
          secondAdminsBusinessAccount,
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};


type PopulateBusinessAccountArgs = {
  businessAccountId: string;
  numOfStores: number;
  numOfStoreImagesPerStore: number;
  numOfStoreItemsPerStore: number;
  numOfStoreItemImgsPerStoreItem: number;
  numOfProducts: number;
  numOfProductImgsPerProduct: number;
  numOfServices: number;
  numOfServiceImgsPerService: number;
}
type PopulateBusinessAccountResponse = {
  populatedBusinessAcct: IBusinessAccount;
  createdStores: IStore[];
  createdStoreImgs: IStoreImage[];
  createdStoreItems: IStoreItem[];
  createdStoreItemImgs: IStoreItemImage[];
  createdServices: IService[];
  createdServiceImgs: IServiceImage[];
  createdProducts: IProduct[];
  createdProductImgs: IProductImage[];
};

export const populateBusinessAccount = async (options: PopulateBusinessAccountArgs): Promise<PopulateBusinessAccountResponse> => {
  const {
    businessAccountId,
    numOfStores, numOfStoreImagesPerStore,
    numOfStoreItemsPerStore, numOfStoreItemImgsPerStoreItem,
    numOfProducts, numOfProductImgsPerProduct,
    numOfServices, numOfServiceImgsPerService
  } = options;

  try {
    // resolve  stores and store images //
    const createdStores = await createStores(numOfStores, businessAccountId);
    const createdStoreImgs: IStoreImage[] = [];
    for await (const store of createdStores) {
      const storeImgs = await createStoreImages(numOfStoreImagesPerStore, store);
      createdStoreImgs.push(...storeImgs);
    }
    // resolve store items and store item images //
    const createdStoreItems: IStoreItem[] = [];
    const createdStoreItemImgs: IStoreItemImage[] = [];
    for await (const store of createdStores) {
      const storeItems = await createStoreItems(numOfStoreItemsPerStore, store);
      createdStoreItems.push(...storeItems);
    }
    for await (const storeItem of createdStoreItems) {
      const storeItemImages = await createStoreItemImages(numOfStoreItemImgsPerStoreItem, storeItem);
      createdStoreItemImgs.push(...storeItemImages);
    }
    // resolve products and product images //
    const createdProducts = await createProducts(numOfProducts, businessAccountId);
    const createdProductImgs: IProductImage[] = [];
    for await (const product of createdProducts) {
      const productImgs = await createProductImages(numOfProductImgsPerProduct, product);
      createdProductImgs.push(...productImgs);
    }
    // resolve services and service images //
    const createdServices = await createServices(numOfServices, businessAccountId);
    const createdServiceImgs: IServiceImage[] = [];
    for await (const service of createdServices) {
      const serviceImgs = await createServiceImages(numOfServiceImgsPerService, service);
      createdServiceImgs.push(...serviceImgs);
    }
    const linkedStoresObjIds = createdStores.map((store) => store._id as Types.ObjectId);
    const linkedServicesObjIds = createdServices.map((service) => service._id as Types.ObjectId);
    const linkedProductsObjIds = createdProducts.map((product) => product._id as Types.ObjectId);
    // update the business account model with new generated data //
    const updatedPopulatedAcccount  = await BusinessAccount.findOneAndUpdate(
      { _id: businessAccountId },
      {
        $push: { 
          linkedStores: { $each: linkedStoresObjIds },
          linkedServices: { $each: linkedServicesObjIds },
          linkedProducts: { $each: linkedProductsObjIds }
        },
      },
      { new: true }
    )
    .populate({ path: "linkedAdmins", model: "Administrator" })
    .populate({ path: "linkedStores", model: "Store" })
    .populate({ path: "linkedServices", model: "Service" })
    .populate({ path: "linkedProducts", model: "Product" })
    .exec();

    return {
      populatedBusinessAcct: updatedPopulatedAcccount!,
      createdStores: createdStores,
      createdStoreImgs: createdStoreImgs,
      createdStoreItems: createdStoreItems,
      createdStoreItemImgs: createdStoreItemImgs,
      createdServices: createdServices,
      createdServiceImgs: createdServiceImgs,
      createdProducts: createdProducts,
      createdProductImgs: createdProductImgs
    };
  } catch (error) {
    throw error;
  }
};

export const cleanupBusinessAccountTestImages = async (...args: string[]): Promise<boolean> => {
  const prodImgPath = path.join(path.resolve(), "public", "uploads", "product_images");
  const serviceImgPath = path.join(path.resolve(), "public", "uploads", "service_images");
  const storeImgPath = path.join(path.resolve(), "public", "uploads", "store_images");
  const storeItemImgPath = path.join(path.resolve(), "public", "uploads", "store_item_images");
  const pathsToCleanup = [ prodImgPath, serviceImgPath, storeImgPath, storeItemImgPath ];

  for await (const imgPath of pathsToCleanup) {
    try {
      await fs.promises.access(imgPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`No images to delete in directory: ${imgPath}`);
        continue;
      } else {
        throw error;
      }
    }
    try { 
      const directories = await fs.promises.readdir(imgPath);
      if (directories.length > 0) {
        for (let i = 0; i < args.length; i++) {
          const stats = await fs.promises.stat(path.join(imgPath, args[i]));
          if (stats.isDirectory()) {
            await fs.promises.rmdir(path.join(imgPath, args[i]), { recursive: true });
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
  return true;
}