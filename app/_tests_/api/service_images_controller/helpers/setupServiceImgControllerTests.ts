import fs from "fs";
import path from "path";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import Service, { IService } from "../../../../models/Service";
import { IServiceImage } from "../../../../models/ServiceImage";
// helpers and data generation //
import { setupDB } from "../../../helpers/dbHelpers";
import { createServices } from "../../../helpers/data_generation/serviceDataGeneration";
import { createAdmins } from "../../../helpers/data_generation/adminsDataGeneration";
import { createServiceImages } from "../../../helpers/data_generation/serviceImageDataGeneration"
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";

type SetupServiceImgContTestRes = {
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
  },
  serviceImages: {
    firstAdminsServiceImgs: IServiceImage[];
    secondAdminsServiceImgs: IServiceImage[];
  }
};

export const setupServiceImgControllerTests = (): Promise<SetupServiceImgContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string, thirdAdminBusAcctId: string;
  let firstAdminsService: IService, secondAdminsService: IService;
  let firstAdminsServiceImgs: IServiceImage[], secondAdminsServiceImgs: IServiceImage[];

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
    .then((servicesArr) => {
      firstAdminsService = servicesArr[0][0];
      secondAdminsService = servicesArr[1][0];
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      return Promise.all([
        createServiceImages(1, firstAdminsService),
        createServiceImages(1, secondAdminsService)
      ]);
    })
    .then((serviceImgs) => {
      [ firstAdminsServiceImgs, secondAdminsServiceImgs ] = serviceImgs;
      // have to return updated Services with image count //
      return Service.find({ _id: { $in: [ firstAdminsService._id, secondAdminsService._id ] } });
    }) 
    .then((services) => {
      [ firstAdminsService, secondAdminsService ] = services;
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
        },
        serviceImages: {
          firstAdminsServiceImgs,
          secondAdminsServiceImgs
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};

export const cleanUpServiceImgControllerTests = (...args: string[]) => {
  const pathToImages = path.join(path.resolve(), "public", "uploads", "service_images");
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
