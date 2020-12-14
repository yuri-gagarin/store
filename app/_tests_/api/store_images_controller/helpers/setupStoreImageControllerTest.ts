import { setupDB } from "../../../helpers/dbHelpers";
import { createStores } from "../../../helpers/data_generation/storesDataGeneration";
import { createAdmins } from "../../../helpers/dataGeneration";
import { createStoreImages } from "../../../helpers/data_generation/storeImageDataGeneration";
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import Store, { IStore } from "../../../../models/Store";
import { IStoreImage } from "../../../../models/StoreImage";
import fs from "fs";
import path from "path";

type SetupStoreImgContTestRes = {
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
  },
  storeImages: {
    firstAdminsStoreImgs: IStoreImage[];
    secondAdminsStoreImgs: IStoreImage[];
  }
};

export const setupStoreImgControllerTests = (): Promise<SetupStoreImgContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string, thirdAdminBusAcctId: string;
  let firstAdminsStore: IStore, secondAdminsStore: IStore;
  let firstAdminsStoreImgs: IStoreImage[], secondAdminsStoreImgs: IStoreImage[];

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
        createStores(5, firstAdminBusAcctId),
        createStores(5, secondAdminBusAcctId)
      ]);
    })
    .then((storesArr) => {
      firstAdminsStore = storesArr[0][0];
      secondAdminsStore = storesArr[1][0];
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      return Promise.all([
        createStoreImages(1, firstAdminsStore),
        createStoreImages(1, secondAdminsStore)
      ]);
    })
    .then((storeImgs) => {
      [ firstAdminsStoreImgs, secondAdminsStoreImgs ] = storeImgs;
      // have to return updated Stores with image count //
      return Store.find({ _id: { $in: [ firstAdminsStore._id, secondAdminsStore._id ] } });
    }) 
    .then((stores) => {
      [ firstAdminsStore, secondAdminsStore ] = stores;
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
        storeImages: {
          firstAdminsStoreImgs,
          secondAdminsStoreImgs
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};

export const cleanUpStoreImgControllerTests = (...args: string[]) => {
  const pathToImages = path.join(path.resolve(), "public", "uploads", "store_images");
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
    })
}
