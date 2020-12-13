import { Request, Response } from "express";
// models, model interfaces and controller interfaces //
import { IAdministrator } from "../../models/Administrator";
import Store from "../../models/Store";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import { IGenericImgUploadCtrl } from '../_helpers/controllerInterfaces';
// additional types and interfaces //
import { IImageUploadDetails } from "../image_uploaders/types/types";
import { StoreImageResponse } from "./helpers/storeImgUpldsControllerTypes";
// helpers //
import { respondWithInputError, deleteFile } from "../_helpers/controllerHelpers";
import { NotFoundError, processErrorResponse } from "../_helpers/errorHandlers";

/**
 * NOTES 
 * When either <createImage> or <deleteImage> action of the 'StoreImgUploadsController' gets 
 * called, the <passport.authenticate> and <checkImgUploadCredentials> middlewares should have 
 * been run. 
 * The 'StoreImgUploadsController' assumes the following: 
 * 1: The Admin has been authenticated and logged in 
 * 2: <req.user> as IAdministrator 'object' exists 
 * 3: <req.user.businessAccountId> property exists
 * 4: <req.user.businessAccountId> === <service.businessAccoundId 
 * 
 * VALID RESPONSE should include: 
 * {
 *    responseMsg: string;
 *    newStoreImage: IStoreImage;
 *    updatedStore: IStore;
 * }
 * 
 * INVALID RESPONSE should include:
 * {
 *    reponseMsg: string;
 *    error: 'object' | Error;
 *    errorMessages: string[];
 * }
 */

class StoreImageUploadController implements IGenericImgUploadCtrl {
  createImage (req: Request, res: Response<StoreImageResponse>): Promise<Response> {
    const { storeId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;
    const{ success, imagePath, absolutePath, fileName, url } = res.locals.uploadDetails as IImageUploadDetails;
    let newImage: IStoreImage;
    
    if (success) {
      return StoreImage.create({
        businessAccountId: businessAccountId,
        storeId: storeId,
        url: url,
        fileName: fileName,
        imagePath: imagePath,
        absolutePath: absolutePath
      })
      .then((storeImage) => {
        newImage = storeImage;
        return (
          Store.findOneAndUpdate(
            { businessAccountId: businessAccountId, _id: storeId },
            { $push: { images: storeImage._id } },
            { upsert: true, new: true }
          )
          .populate("images").exec()
        );
      })
      .then((updatedStore) => {
        return res.status(200).json({
          responseMsg: "Store image uploaded",
          newStoreImage: newImage,
          updatedStore: updatedStore
        });
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
    } else {
      return respondWithInputError(res, "Image not uploaded", 500, [ "Something seems to have went wrong on our end" ]);
    }
  }

  deleteImage (req: Request, res: Response<StoreImageResponse>): Promise<Response> {
    const { storeImgId, storeId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;
    let deletedImage: IStoreImage;

    if (!storeImgId && !storeId) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }
    
    return StoreImage.findOne(
      { businessAccountId: businessAccountId, _id: storeImgId }
    )
    .then((storeImage) => {
      if (storeImage) {
        return deleteFile(storeImage.absolutePath);
      } else {
        throw new NotFoundError({ 
          errMessage: "Coudn't delete Store Image", 
          messages: [ "Requested Store Image was not found in the database" ]
        });
      }
    })
    .then(() => {
      return StoreImage.findOneAndDelete({ businessAccountId: businessAccountId, _id: storeImgId });
    })
    .then((image) => {
      if (image ) {
        deletedImage = image!;
        return Store.findOneAndUpdate(
          { _id: storeId },
          { $pull: { images: storeImgId }},
          { new: true }
        )
        .populate("images").exec();
      } else {
        throw new NotFoundError({
          errMessage: "Queried Image not found",
          messages: [ "Could not find queried Image in the database to delete" ]
        });
      }
    })
    .then((updatedStore) => {
      if (updatedStore) {
        return res.status(200).json({
          responseMsg: "Image deleted",
          deletedStoreImage: deletedImage,
          updatedStore: updatedStore
        });
      } else {
        throw new NotFoundError({
          errMessage: "Queried Service not found",
          messages: [ "Could not find queried Service in the database to update" ]
        });
      }
    })
    .catch((err) => {
      return processErrorResponse(res, err);
    });
  }
  /*
  private parallelQuery (): Promise<boolean> {
    return new Promise((resolve, reject) => {

    })
  }
  */
}

export default StoreImageUploadController;