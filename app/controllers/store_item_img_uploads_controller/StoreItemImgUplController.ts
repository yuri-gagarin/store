import e, { Request, Response } from "express";
// models, model interfaces and types //
import { IAdministrator } from "../../models/Administrator";
import StoreItem from "../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../models/StoreItemImage";
import { IGenericImgUploadCtrl } from '../_helpers/controllerInterfaces';
import { IImageUploadDetails } from "../image_uploaders/types/types";
// additional types and interfaces //
import { StoreItemImgRes} from "./type_declarations/storeItemImgUplsContTypes";
// helpers //
import { respondWithInputError, respondWithDBError, deleteFile, respondWithGeneralError } from "../_helpers/controllerHelpers";
import { NotFoundError, processErrorResponse } from "../_helpers/errorHandlers";



class StoreItemImageUploadController implements IGenericImgUploadCtrl {

  createImage (req: Request, res: Response<StoreItemImgRes>): Promise<Response> {
    const { storeItemId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;
    const { success, imagePath, fileName, absolutePath, url } =res.locals.uploadDetails as IImageUploadDetails;

    let newImage: IStoreItemImage;

    if (success) {
      return StoreItemImage.create({
        businessAccountId: businessAccountId,
        storeItemId: storeItemId,
        fileName: fileName,
        imagePath: imagePath,
        absolutePath: absolutePath,
        url: url
      })
      .then((storeItemImage) => {
        newImage = storeItemImage;
        return (
          StoreItem.findOneAndUpdate(
            { _id: storeItemId },
            { $push: { images: storeItemImage._id } },
            { upsert: true, new: true }
          )
          .populate("images").exec()
        );
      })
      .then((updatedStoreItem) => {
        return res.status(200).json({
          responseMsg: "Store Item image uploaded",
          newStoreItemImage: newImage,
          updatedStoreItem: updatedStoreItem
        });
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
    } else {
      return respondWithInputError(res, "Something went wrong", 500, [ "Image not uploaded" ]);
    }
  }

  deleteImage (req: Request, res: Response): Promise<Response> {
    const { storeItemId, storeItemImgId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;

    let deletedImage: IStoreItemImage;

    if (!storeItemImgId) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }

    return (
      StoreItemImage.findOne(
        { businessAccountId: businessAccountId, storeItemId: storeItemId, _id: storeItemImgId }
      ).exec()
    )
    .then((storeItemImg) => {
      if (storeItemImg) {
        return deleteFile(storeItemImg.absolutePath);
      } else {
        throw new NotFoundError({
          errMessage: "Couldn't delete StoreItem Image",
          messages: [ "Requested StoreItem Image was not found in the database" ]
        })
      }
    })
    .then((_) => {
      return StoreItemImage.findOneAndDelete(
        { businessAccountId: businessAccountId, storeItemId: storeItemId, _id: storeItemImgId }
      ).exec();
    })
    .then((image) => {
      if (image) {
        deletedImage = image!;
        return StoreItem.findOneAndUpdate(
          { _id: storeItemId },
          { $pull: { images: storeItemImgId } },
          { new: true }
        ).populate("images").exec();
      } else {
        throw new NotFoundError({
          errMessage: "Queried Image not found",
          messages: [ "Could not find queried Image in the database to delete" ]
        });
      }
    })
    .then((updatedStoreItem) => {
      if (updatedStoreItem) {
        return res.status(200).json({
          responseMsg: "Image deleted",
          deletedStoreItemImage: deletedImage,
          updatedStoreItem: updatedStoreItem!
        });
      }  else {
        throw new NotFoundError({
          errMessage: "Queried Store Item not found",
          messages: [ "Could not find queried Store Item in the database to update" ]
        });
      }
      
    })
    .catch((err) => {
      return processErrorResponse(res, err);
    });
  }

}

export default StoreItemImageUploadController;