import fs from "fs";
import path from "path";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import StoreItem, { IStoreItem } from "../../../../models/StoreItem";
import { IStoreItemImage } from "../../../../models/StoreItemImage";
// helpers and data generation //
import { setupDB } from "../../../helpers/dbHelpers";
import { createStores } from "../../../helpers/data_generation/storesDataGeneration"; 
import { createStoreItems } from "../../../helpers/data_generation/storeItemDataGenerations"
import { createAdmins } from "../../../helpers/dataGeneration";
import { createStoreItemImages } from "../../../helpers/data_generation/storeItemImageDataGeneration"
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";
import Store, { IStore } from "../../../../models/Store";

type SetupStoreItemImgContTestRes = {
  admins: {
    firstAdmin: IAdministrator,
    secondAdmin: IAdministrator,
    thirdAdmin: IAdministrator
  },
  busAccountIds: {
    firstAdminBusAcctId: string;
    secondAdminBusAcctId: string;
    thirdAdminBusAcctId: string;
  }
  stores: {
    firstAdminsStore: IStore;
    secondAdminsStore: IStore;
  }
  storeItems: {
    firstAdminsStoreItem: IStoreItem;
    secondAdminsStoreItem: IStoreItem;
  },
  storeItemImages: {
    firstAdminsStoreItemImgs: IStoreItemImage[];
    secondAdminsStoreItemImgs: IStoreItemImage[];
  }
};

export const setupStoreItemImgControllerTests = (): Promise<SetupStoreItemImgContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminsStore: IStore, secondAdminsStore: IStore;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string, thirdAdminBusAcctId: string;
  let firstAdminsStoreItem: IStoreItem, secondAdminsStoreItem: IStoreItem;
  let firstAdminsStoreItemImgs: IStoreItemImage[], secondAdminsStoreItemImgs: IStoreItemImage[];

  return setupDB()
    .then(() => {
      return createAdmins(3);
    }) 
    .then((adminsArr) => {
      [ firstAdmin, secondAdmin, thirdAdmin ] = adminsArr;
      return Promise.all([
        createBusinessAcccount({ admins: [ firstAdmin ] }),
        createBusinessAcccount({ admins: [ secondAdmin ] })
      ]);
    })
    .then((busAccountArr) => {
      [ firstAdminBusAcctId, secondAdminBusAcctId ] = busAccountArr.map((acc) => String(acc._id));
      return Promise.all([
        createStores(1, firstAdminBusAcctId),
        createStores(1, secondAdminBusAcctId)
      ]);
    })
    .then((storesArr) => {
      [ firstAdminsStore ] = storesArr[0];
      [ secondAdminsStore ] = storesArr[1];
      return Promise.all([
        createStoreItems(1, firstAdminsStore),
        createStoreItems(1, secondAdminsStore)
      ])
    })
    .then((storeItemsArr) => {
      [ firstAdminsStoreItem ] = storeItemsArr[0];
      [ secondAdminsStoreItem ] = storeItemsArr[1];
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      return Promise.all([
        createStoreItemImages(1, firstAdminsStoreItem),
        createStoreItemImages(1, secondAdminsStoreItem)
      ]);
    })
    .then((storeItemImgs) => {
      [ firstAdminsStoreItemImgs, secondAdminsStoreItemImgs ] = storeItemImgs;
      // have to return updated StoreItems with image count //
      return StoreItem.find({ _id: { $in: [ firstAdminsStoreItem._id, secondAdminsStoreItem._id ] } });
    }) 
    .then((storeItems) => {
      [ firstAdminsStoreItem, secondAdminsStoreItem ] = storeItems;
      return Store.find({ _id: { $in: [ firstAdminsStore._id, secondAdminsStore._id ] } });
    })
    .then((updatedStoresArr) => {
      [ firstAdminsStore, secondAdminsStore ] = updatedStoresArr;
      return {
        admins: {
          firstAdmin,
          secondAdmin,
          thirdAdmin
        },
        busAccountIds: {
          firstAdminBusAcctId,
          secondAdminBusAcctId,
          thirdAdminBusAcctId
        },
        stores: {
          firstAdminsStore,
          secondAdminsStore
        },
        storeItems: {
          firstAdminsStoreItem,
          secondAdminsStoreItem
        },
        storeItemImages: {
          firstAdminsStoreItemImgs,
          secondAdminsStoreItemImgs
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};

export const cleanUpStoreItemImgControllerTests = (...args: string[]) => {
  const pathToImages = path.join(path.resolve(), "public", "uploads", "store_item_images");
  return fs.promises.access(pathToImages)
    .then((_) => {
      return fs.promises.readdir(pathToImages)
    })
    .then((directories) => {
      if (directories.length > 0) {
        for (let i = 0; i < args.length; i++) {
          const stats = fs.statSync(path.join(pathToImages, args[i]));
          if (stats.isDirectory()) {
            fs.rmdirSync(path.join(pathToImages, args[i]), { recursive: true });
          }
        }
      }
      return true;
    })
    .catch((err) => {
      if (err.code === "ENOENT") {
        console.log("No image to delete");
        return true;
      } else {
        throw err;
      }
    });
};
