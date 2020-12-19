import chaiHTTP from "chai-http";
import { setupDB } from "../../../helpers/dbHelpers";
import { createAdmins } from "../../../helpers/data_generation/adminsDataGeneration";
import { createStoreItems } from "../../../helpers/data_generation/storeItemDataGenerations";
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import { IStoreItem } from "../../../../models/StoreItem";
import { createStores } from "../../../helpers/data_generation/storesDataGeneration";
import { IStore } from "../../../../models/Store";

type SetupStoreItemContTestRes = {
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
  storeItems: {
    firstAdminsStoreItems: IStoreItem[];
    secondAdminsStoreItems: IStoreItem[];
  }
};

export const setupStoreItemControllerTests = (): Promise<SetupStoreItemContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string, thirdAdminBusAcctId: string;
  let firstAdminsStore: IStore, secondAdminsStore: IStore;
  let firstAdminsStoreItems: IStoreItem[], secondAdminsStoreItems: IStoreItem[];

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
    .then((stores) => {
       [ firstAdminsStore ] = stores[0];
       [ secondAdminsStore ] = stores[1];
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      return Promise.all([
        createStoreItems(5, firstAdminsStore),
        createStoreItems(5, secondAdminsStore)
      ]);
    })
    .then((storeItemsArr) => {
      [ firstAdminsStoreItems, secondAdminsStoreItems ] = storeItemsArr;
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
          firstAdminsStoreItems,
          secondAdminsStoreItems
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};