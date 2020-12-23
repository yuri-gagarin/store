import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { respondWithInputError, respondWithNotAllowedErr, respondWithNotFoundError } from "../controllers/_helpers/controllerHelpers";
import { NotAllowedError, NotFoundError, processErrorResponse, ValidationError } from "../controllers/_helpers/errorHandlers";
import Administrator, { IAdministrator } from "../models/Administrator";
import BusinessAccount from "../models/BusinessAccount";
import { IProduct } from "../models/Product";
import { IService } from "../models/Service";
import Store, { IStore } from "../models/Store";
import StoreItem, { IStoreItem } from "../models/StoreItem";

/*
 * Notes: getting crowded and disorganized.
 * Todo: separate some methods into respective files 

 */


export const POSTRequestTrimmer = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "POST") {
    if (Object.keys(req.body).length > 0) {
      for (const [ key, value ] of Object.entries(req.body)) {
        if (typeof value === "string") {
          req.body[key] = (value as string).trim();
        }
      }
    }
  }
  next();
};

type ImgSupportingModel = IStore | IStoreItem | IService | IProduct;
export const checkImgUploadCredentials = async (req: Request, res: Response, next: NextFunction) => {
  const administrator: IAdministrator = req.user as IAdministrator;
  let modelToQuery: string;
  let modelId: string;
  let businessAccountId: Types.ObjectId;
  // check for a present administrator and valid businessAccountId //
  if (administrator) {
    if (!administrator.businessAccountId) {
      return respondWithNotAllowedErr(res, "Not Allowed", 401, [ "Can't upload any images without a Business Account set up" ]);
    } else {
      businessAccountId = administrator.businessAccountId;
    }
  } else {
    return respondWithNotAllowedErr(res, "Not Allowed", 401, [ "Cant resolve a logged in Administrator" ]);
  }
  const { storeId, storeItemId, productId, serviceId } = req.params;
  // set model which to query // 
  if (storeId) {
    modelToQuery = "Store";
    modelId = storeId;
  } else if (storeItemId) {
    modelToQuery = "StoreItem";
    modelId = storeItemId;
  } else if (productId) {
    modelToQuery = "Product";
    modelId = productId;
  } else if (serviceId) {
    modelToQuery = "Service";
    modelId = serviceId;
  } else {
    return respondWithInputError(res, "Input Error", 400, [ "Cant resolve a model for image upload" ]);
  }

  mongoose.models[modelToQuery].findOne({ _id: modelId })
    .then((model: ImgSupportingModel) => {
      if ((model.businessAccountId as Types.ObjectId).equals(businessAccountId)) {
        next();
      } else {
        return respondWithNotAllowedErr(res, "Not Allowed", 401, [ "Not allowed to upload images to resources not belonging to your account" ]);
      }
    });
};

export const verifyAdminAndBusinessAccountId =  (req: Request, res: Response, next: NextFunction) => {
  const administrator: IAdministrator = req.user as IAdministrator;
  if (administrator) {
    if (!administrator.businessAccountId) {
      return respondWithNotAllowedErr(res, "Not Allowed", 401, [ "Please create or be added to a business account to get all features" ]);
    } else {
      next();
    }
  } else {
    return respondWithNotAllowedErr(res, "Not Alowed", 401, [ "Cannot resolve an Administrator account" ]);
  }
};

export const verifyStoreItemModelAccess = (req: Request, res: Response, next: NextFunction) => {

  const admin = req.user as IAdministrator;
   
  if ((req.method === "GET") && (req.params.storeItemId)) {
    StoreItem.findOne({ _id: req.params.storeItemId }).exec()
      .then((storeItem) => {
        if (storeItem) {
          return Promise.resolve(storeItem);
        } else {
          throw new NotFoundError({
            messages: [ "Could not find the queried Store Item model" ]
          });
        } 
      })
      .then((storeItem) => {
        if ((storeItem.businessAccountId as Types.ObjectId).equals(admin.businessAccountId!)) {
          next();
        } else {
          throw new NotAllowedError({
            errMessage: "Action not allowed",
            messages: [ "Not allowed to query a Store Item not belonging to your account" ]
          });
        }
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
  }

  if ((req.method === "POST") || (req.method === "PATCH") || (req.method === "DELETE")) {
    const { storeId } = req.params;
    Store.findOne({ _id: storeId })
      .then((store) => {
        if (!store) {
          const errMessages = [ "Could not resolve the Store model to link Store Item to" ];
          throw new NotFoundError({
            errMessage: "Not Found",
            messages:  errMessages
          });
        } else {
          return Promise.resolve(store);
        }
      })
      .then((store) => {
        if ((store.businessAccountId as Types.ObjectId).equals(admin.businessAccountId!)) {
          next();
        } else {
          throw new NotAllowedError({
            errMessage: "Action not allowed",
            messages: [ "Not allowed to manage Store Items on a Store which does not belong to your account" ]
          });
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }
};

type DataModel = IStore | IStoreItem | IService | IProduct;
export const verifyDataModelAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { storeId, storeItemId, serviceId, productId } = req.params;
  const admin: IAdministrator = req.user as IAdministrator;
  let dataModel: string, modelId: string;

  if (storeId) {
    dataModel = "Store";
    modelId = storeId;
  } else if (storeItemId) {
    dataModel = "StoreItem";
    modelId = storeItemId;
  } else if (serviceId) {
    dataModel = "Service";
    modelId = serviceId;
  } else if (productId) {
    dataModel = "Product";
    modelId = productId;
  } else {
    return respondWithInputError(res, "Input error", 400, [ "Could not resolve data model to query" ]);
  }

  mongoose.models[dataModel].findOne({ _id: modelId }).exec()
    .then((model: DataModel) => {
      if (model) {
        if ((model.businessAccountId as Types.ObjectId).equals(admin.businessAccountId!)) {
          next();
        } else {
          return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "Cannot query data not belongint to your Business Account" ]);
        }
      } else {
        return respondWithNotFoundError(res, "Not Found", 404, [ "Could not find queried data model" ]);
      }
    })
    
};

export const verifyBusinessAccountAccess = (req: Request, res: Response, next: NextFunction) => {
  const admin = req.user as IAdministrator;
  const { businessAcctId } = req.params;
  // check if user/admin exists first //
  if (!businessAcctId) {
    return respondWithNotFoundError(res, "Invalid Input", 422, [ "Cannot resolve your 'BusinessAccount' model id" ]);
  }
  if (admin) {
    if (!admin.businessAccountId) {
      // admin exists and can get or edit this account //
      const errorMessages = [
        "Cannot resolve your administrator account",
        "Please create a BusinessAccount first"
      ]
      return respondWithNotAllowedErr(res, "Not Allowed", 401, errorMessages);
    } else {
      if ((admin.businessAccountId as Types.ObjectId).equals(businessAcctId)) {
        next();
      } else {
        return respondWithNotAllowedErr(res, "Not Allowed", 401, [ "Cannot access a Business Account which does not belong to you" ]);
      }
    } 
  } else {
    return respondWithNotAllowedErr(res, "Not Allowed", 401, [ "Seems like we can't resolve your admin credentials" ]);
  }
};

export const checkNewAdminsForBusinessAccUpdate = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.newAdmins && Array.isArray(req.body.newAdmins) && req.body.newAdmins.length > 0) {
    Administrator.find({ _id: { $in: req.body.newAdmins } }).exec() 
      .then((administrators) => {
        if (!administrators) {
          throw new NotFoundError({
            errMessage: "Resources not Found",
            messages: [ "Could not resolve new Administrators to add" ]
          });
        } else if (administrators.length < req.body.newAdmins.length) {
          const adminIds: string[] = administrators.map((admin) => admin._id.toString());
          const incorrectIds: string[] = req.body.newAdmins.filter((adminId: string) => adminIds.indexOf(adminId) < 0);
          throw new NotFoundError({
            errMessage: "All admins not Found",
            messages: [ "Could not resolve some of the new 'Administrators' to add", "Incorrect Ids:", ...incorrectIds ]
          });
        } else {
          return Promise.resolve(administrators);
        }
      })
      .then((administrators) => {
        const adminsWithBusAccount = administrators.filter((admin) => admin.businessAccountId).map((admin) => admin.email);
        if (adminsWithBusAccount.length > 0) {
          throw new ValidationError({
            errMessage: "Cant assign admins with an existing Business account",
            statusCode: 422,
            messages: [
              "The following Administrators have existing business accounts",
              ...adminsWithBusAccount
            ]
          })
        } else {
          next();
        }
      }) 
      .catch((err) => {
        return processErrorResponse(res, err);
      }) 
  } else {
    next();
  }
}