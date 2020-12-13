import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { respondWithInputError, respondWithNotAllowedErr, respondWithNotFoundError } from "../controllers/helpers/controllerHelpers";
import { IAdministrator } from "../models/Administrator";
import { IProduct } from "../models/Product";
import { IService } from "../models/Service";
import { IStore } from "../models/Store";
import { IStoreItem } from "../models/StoreItem";

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
    
}