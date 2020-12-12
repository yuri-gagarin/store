import { Request, Response } from "express";
// models, model interfaces and controller interfaces //
import { IAdministrator } from "../../models/Administrator";
import Store from "../../models/Store";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import { IGenericImgUploadCtrl } from '../helpers/controllerInterfaces';
import { StoreImageResponse } from "./helpers/storeImgUpldsControllerTypes";
// additional types and interfaces //
import { IImageUploadDetails } from "../image_uploaders/types/types";
// helpers //
import { respondWithInputError, respondWithDBError, deleteFile } from "../helpers/controllerHelpers";
import { NotFoundError, processErrorResponse } from "../helpers/errorHandlers";



class StoreImageUploadController implements IGenericImgUploadCtrl {
  createImage (req: Request, res: Response<StoreImageResponse>): Promise<Response> {
    const { storeId } = req.params;
    const admin = req.user as IAdministrator;

    const uploadDetails: IImageUploadDetails = res.locals.uploadDetails as IImageUploadDetails;
    const { success, imagePath, absolutePath, fileName, url } = uploadDetails;
    let newImage: IStoreImage;
    
    if (success) {
      return StoreImage.create({
        businessAccountId: admin.businessAccountId,
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
            { _id: storeId },
            { $push: { images: storeImage._id } },
            { upsert: true, new: true }
          ).populate("images").exec()
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
        return respondWithDBError(res, err);
      });
    } else {
      return respondWithInputError(res, "Image not uploaded", 500, [ "Something seems to have went wrong on our end" ]);
    }
  }

  deleteImage (req: Request, res: Response<StoreImageResponse>): Promise<Response> {
    const { storeImgId, storeId } = req.params;
    let deletedImage: IStoreImage;

    if (!storeImgId && !storeId) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }
    
    return StoreImage.findById(storeImgId)
      .then((storeImage) => {
        if (storeImage) {
          return deleteFile(storeImage.absolutePath);
        } else {
          throw new NotFoundError({ messages: [ "Cant't resolve StoreImage to delete" ] });
        }
      })
      .then(() => {
        return StoreImage.findOneAndDelete({ _id: storeImgId });
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
          throw new NotFoundError({ messages: [ "Cant't resolve StoreImage to delete" ] });
        }
      })
      .then((updatedStore) => {
        return res.status(200).json({
          responseMsg: "Image deleted",
          deletedStoreImage: deletedImage,
          updatedStore: updatedStore!
        });
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