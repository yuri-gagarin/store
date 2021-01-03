import { Types } from "mongoose";
import { setupDB } from "../../../helpers/dbHelpers";
import { createStores } from "../../../helpers/data_generation/storesDataGeneration";
import { createAdmins } from "../../../helpers/data_generation/adminsDataGeneration";
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import { IStore } from "../../../../models/Store";
import BusinessAccount from "../../../../models/BusinessAccount";

type SetupStoresContTestRes = {
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
};

export const setupStoreControllerTests = (): Promise<SetupStoresContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string, thirdAdminBusAcctId: string;
  let firstAdminsStores: IStore[], secondAdminsStores: IStore[];
  let firstAdminsStore: IStore, secondAdminsStore: IStore;

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
      [ firstAdminsStores, secondAdminsStores ]= storesArr;
      firstAdminsStore = storesArr[0][0];
      secondAdminsStore = storesArr[1][0];
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      const firstAdminsStoreIds = firstAdminsStores.map((store) => store._id as Types.ObjectId);
      const secondAdminsStoreIds = secondAdminsStores.map((store) => store._id as Types.ObjectId);

      return Promise.all([
        BusinessAccount.findOneAndUpdate({ _id: firstAdmin.businessAccountId }, { $push: { linkedStores: { $each: firstAdminsStoreIds } } }),
        BusinessAccount.findOneAndUpdate({ _id: secondAdmin.businessAccountId }, { $push: { linkedStores: { $each: secondAdminsStoreIds } } }),
      ]);
    })
    .then((_) => {
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
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};
