import { Request, Response } from "express";
import { link } from "fs";
import { Types } from "mongoose";
import AdminAccount,  { AccountLevel, IAdminAccount } from "../../models/AdminAccount";
import { IAdministrator } from "../../models/Administrator";
import { IServiceImage } from "../../models/ServiceImage";
import Store from "../../models/Store";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import { AdminControllerRes } from "../admins_controller/type_declarations/adminsControllerTypes";
import { removeDirectoryWithFiles, RemoveResponse, resolveDirectoryOfImg, respondWithDBError, respondWithGeneralError, respondWithInputError, rejectWithGenError } from "../helpers/controllerHelpers";
import { IGenericController } from "../helpers/controllerInterfaces"

type AdminAccountsContRes = {
  responseMsg: string;
  adminAccounts?: IAdminAccount[];
  newAdminAcccount?: IAdminAccount;
  adminAccount?: IAdminAccount;
  editedAdminAccount?: IAdminAccount;
  deletedAdminAccount?: IAdminAccount;
  error?: Error;
}
type CreteAccountBodyReq = {

}
type EditAccountBodyReq = {
  linkedAdmins: Types.ObjectId[];
  linkedStores: Types.ObjectId[];
  linkedServices: Types.ObjectId[];
}
type AdminAccountsContReqParams = {
  adminAccountId: string;
}
class AdminAccountsController implements IGenericController {
  index(req: Request, res: Response): Promise<Response> {
    const user = req.user as IAdministrator;
    if (!user) {

    }
  }
  get(req: Request<AdminAccountsContReqParams>, res: Response<AdminAccountsContRes>): Promise<Response> {
    const { adminAccountId } = req.params;
    if (!adminAccountId) {
      return respondWithInputError(res, "Cant resolve an account to look for", 422);
    }
    return AdminAccount.findOne({ _id: adminAccountId })
      .populate({ path: "stores", model: "store", select: "-images" })
      .populate({ path: "services", model: "service", select: "-images" })
      .exec()
      .then((adminAccount) => {
        if (adminAccount) {
          return res.status(200).json({
            responseMsg: `Account with id of ${adminAccountId}`,
            adminAccount: adminAccount
          })
        } else {
          return respondWithGeneralError(res, "Could not find an account", 404);
        }
      })
      .catch((err) => respondWithDBError(res, err));
  }
  create(req: Request, res: Response): Promise<Response> {
    const admin = req.user  as IAdministrator;
    const { _id: adminId } = admin;
    if (admin.adminAccountId) {
      return respondWithGeneralError(res, "You already have an account set up", 422);
    }
    return AdminAccount.create({ 
      adminAccounts: [ adminId ],
      linkedStores: [],
      linkedServices: [],
      accountLevel: AccountLevel.Standard
    })
    .then((adminAccount) => {
      return res.status(200).json({
        responseMsg: "Created a new admin account",
        newAdminAcccount: adminAccount
      });
    })
    .catch((err) => respondWithDBError(res, err));
  } 
  edit(req: Request<AdminAccountsContReqParams, {},EditAccountBodyReq>, res: Response<AdminAccountsContRes>): Promise<Response> {
    const { adminAccountId } = req.params;
    const { linkedAdmins, linkedStores, linkedServices } = req.body;
    if (adminAccountId) {
      return respondWithInputError(res, "Cannot resolve account to edit", 422);
    }

    return AdminAccount.findOneAndUpdate(
      { _id: adminAccountId },
      { 
        linkedAdmins: [ ...linkedAdmins ],
        linkedStores: [ ...linkedStores ],
        linkedServices: [ ...linkedServices ],
        editedAt: new Date(Date.now())
      },
      {
        new: true
      }
    )
    .then((updatedAccount) => {
      if (updatedAccount) {
        return res.status(200).json({
          responseMsg: `Updated account ${updatedAccount._id}`,
          editedAdminAccount: updatedAccount
        })
      } else {
        return respondWithGeneralError(res, "Could not find the account to update", 404);
      }
    })
    .catch((err) => respondWithDBError(res, err));
  }
  delete(req: Request<AdminAccountsContReqParams>, res: Response<AdminControllerRes>) {
    const { adminAccountId } = req.params;
    const storeImgDirectories: string[] = [];
    const storeItemImgDirectories: string[] = []
    const serviceImgDirectores: string[] = [];
    //
    let linkedStores: Types.ObjectId[];
    let linkedServices: Types.ObjectId[];
    let storeImages: IStoreImage[];
    let serviceImages: IServiceImage[];
    // 
    let numOfStoresDeleted: number = 0;
    let numOfStoreImagesDeleted: number = 0;
    let numOfStoreItemDeleted: number = 0;
    let numOfStoreItemImagesDeleted: number = 0;
    let numOfServicesDeleted: number = 0;
    let numOfServiceImagesDeleted: number = 0;

    if (!adminAccountId) {
      return respondWithInputError(res, "Cannot resolve account to delete", 422);
    }
    return AdminAccount.findOneAndDelete({ _id: adminAccountId })
      .then((adminAccount) => {
        if(adminAccount) { 
          // delete the admin acccount check for stores and services //
          linkedStores = adminAccount.linkedStores as Types.ObjectId[];
          linkedServices = adminAccount.linkedServices as Types.ObjectId[];
          if(linkedStores.length > 0) {
            return Store.find({ _id: { $in: linkedStores } })
              .populate("images").exec();
          }
          else {
            return Promise.resolve(null);
          }
        } else {
          return rejectWithGenError(res, "Unable to resolve account", 404);
        }
      })
      .then((foundStores) => {
        if (foundStores) {
          // stores found // 
          // set the image directories to delete then remove stores from database //
          for (const store of foundStores) {
            if (store.images.length > 0) {
              const imgDirectory = (store.images[0] as IStoreImage).absolutePath;
              storeImgDirectories.push(resolveDirectoryOfImg(imgDirectory));
            }
          }
          return Store.deleteMany({ _id: { $in: linkedStores } }).exec();
        } else {
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ n }) => {
        numOfStoresDeleted = n ? n : 0;
        // delete store images if any //
        // check if actual store images to delete //
        if ((numOfStoresDeleted > 0) && (storeImgDirectories.length > 0)) {
          return StoreImage.deleteMany({ storeId: { $in: linkedStores } });
        } else {
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ ok, n }) => {
        const storeImgDeletePromises: Promise<RemoveResponse>[] = [];
        numOfStoreImagesDeleted = n ? n : 0;
        // remove store images from files if any were deleted from db //
        if (ok && (numOfStoreImagesDeleted > 0) && (storeImgDirectories.length > 0)) {
          for (const storeImgDirectory of storeImgDirectories) {
            storeImgDeletePromises.push(removeDirectoryWithFiles(storeImgDirectory));
          }
          return Promise.all(storeImgDeletePromises);
        } else {
          return Promise.resolve([]);
        }
      })
      .then((response) => {
        const directoriesLength = response.length;
      })
      .catch((err) => {
        return res.json({
          responseMsg: "An error occured",
          error: err
        })
      })
          /*
          linkedStores = adminAccount.linkedStores as Types.ObjectId[];
          linkedServices = adminAccount.linkedServices as Types.ObjectId[];
          if (linkedStores.length > 0) {
            return Store.find({ _id: { $in: linkedStores } })
              .populate("images").exec()
              .then((stores) => {
                for (const store of stores) {
                  if (store.images.length > 0) {
                    const imgDirectory = (store.images[0] as IStoreImage).absolutePath;
                    storeImgDirectories.push(resolveDirectoryOfImg(imgDirectory));
                    storeImages = storeImages.concat(store.images as IStoreImage[]);
                  }
                }
                return Store.deleteMany({ _id: { $in: linkedStores }});
              })
              .then(({ ok, n }) => {
                if (storeImages.length > 0) {
                  const imgIds = storeImages.map((storeImg) => storeImg._id as Types.ObjectId);
                  return StoreImage.deleteMany({ _id: { $in: imgIds } })
                    .then(({ ok, n}) => {
                      const storeImgDeletePromises: Promise<RemoveResponse>[] = [];
                      for (const directory of storeImgDirectories) {
                        storeImgDeletePromises.push(removeDirectoryWithFiles(directory))
                      }
                      return Promise.all(storeImgDeletePromises);
                    })
                    .then((responseArr) => {
                      for (const res of responseArr) {
                        numOfStoreItemDeleted += res.numberRemoved;
                      }
                      return Promise.resolve(true);
                    })
                    .catch((err: Error) => respondWithDBError(res, err));
                } else {
                  return Promise.resolve(true)
                }
              })
              .then((response) => {
                return Promise.resolve()
              })
          } else {

          }
        }
      })
      .catch((err) => {

      })
      
  }   
  */
  }
};

export default AdminAccountsController;