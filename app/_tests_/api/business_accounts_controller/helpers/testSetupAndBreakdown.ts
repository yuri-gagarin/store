import { setupDB } from "../../../helpers/dbHelpers";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import { IBusinessAccount } from "../../../../models/BusinessAccount";
// helpers and data generating methods //
import { createAdmins } from "../../../helpers/data_generation/adminsDataGeneration";
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";

type SetupBusinessAcctContTestRes = {
  admins: {
    firstAdmin: IAdministrator,
    secondAdmin: IAdministrator,
    thirdAdmin: IAdministrator
  },
  businessAccounts: {
    firstAdminsBusinessAccount: IBusinessAccount
    secondAdminsBusinessAccount: IBusinessAccount
    thirdAdminsBusinessAccount: IBusinessAccount
  }
};

export const setupBusinessAccountControllerTests = (): Promise<SetupBusinessAcctContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminsBusinessAccount: IBusinessAccount, secondAdminsBusinessAccount: IBusinessAccount, thirdAdminsBusinessAccount: IBusinessAccount;

  return setupDB()
    .then(() => {
      return createAdmins(3);
    }) 
    .then((adminsArr) => {
      [ firstAdmin, secondAdmin, thirdAdmin ] = adminsArr;
      return Promise.all([
        createBusinessAcccount({ admins: [ firstAdmin ] }),
        createBusinessAcccount({ admins: [ secondAdmin ] }),
        createBusinessAcccount({ admins: [ thirdAdmin ] })
      ]);
    })
    .then((busAccountArr) => {
      [ firstAdminsBusinessAccount, secondAdminsBusinessAccount, thirdAdminsBusinessAccount ] = busAccountArr;
      
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminsBusinessAccount._id } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminsBusinessAccount._id } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: thirdAdmin._id }, { $set: { businessAccountId: thirdAdminsBusinessAccount._id } }, { new: true })
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      return {
        admins: {
          firstAdmin,
          secondAdmin,
          thirdAdmin
        },
        businessAccounts: {
          firstAdminsBusinessAccount,
          secondAdminsBusinessAccount,
          thirdAdminsBusinessAccount
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};