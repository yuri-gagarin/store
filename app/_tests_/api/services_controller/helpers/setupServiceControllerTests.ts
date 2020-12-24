import chaiHTTP from "chai-http";
import { setupDB, clearDB } from "../../../helpers/dbHelpers";
import { createAdmins } from "../../../helpers/data_generation/adminsDataGeneration";
import { createServices } from "../../../helpers/data_generation/serviceDataGeneration";
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import Service, { IService } from "../../../../models/Service";

type SetupServiceContTestRes = {
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
  services: {
    firstAdminsService: IService;
    secondAdminsService: IService;
  }
};

export const setupServiceControllerTests = (): Promise<SetupServiceContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string, thirdAdminBusAcctId: string;
  let firstAdminsService: IService, secondAdminsService: IService;

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
        createServices(5, firstAdminBusAcctId),
        createServices(5, secondAdminBusAcctId)
      ]);
    })
    .then((services) => {
      firstAdminsService = services[0][0];
      secondAdminsService = services[1][0];
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
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
        busAccountIds: {
          firstAdminBusAcctId,
          secondAdminBusAcctId,
          thirdAdminBusAcctId
        },
        services: {
          firstAdminsService,
          secondAdminsService
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};