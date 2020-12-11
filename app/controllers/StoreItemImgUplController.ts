import { Request, Response } from "express";
import { IGenericImgUploadCtrl } from './helpers/controllerInterfaces';
import { IImageUploadDetails } from "./image_uploaders/types/types";
import StoreItemImage, { IStoreItemImage } from "../models/StoreItemImage";
// helpers //
import { respondWithInputError, respondWithDBError, normalizeImgUrl, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";
import StoreItem, { IStoreItem } from "../models/StoreItem";

type StoreItemImgRes = {
  responseMsg: string;
  newStoreItemImage?: IStoreItemImage;
  deletedStoreItemImage?: IStoreItemImage;
  updatedStoreItem: IStoreItem;
}

class StoreItemImageUploadController implements IGenericImgUploadCtrl {

  createImage (req: Request, res: Response<StoreItemImgRes>): Promise<Response> {
    const { _store_item_id: storeItemId } = req.params;
    const uploadDetails: IImageUploadDetails = res.locals.uploadDetails as IImageUploadDetails;
    const { success, imagePath, fileName, absolutePath, url } = uploadDetails;
    let newImage: IStoreItemImage;

    if (success) {
      return StoreItemImage.create({
        storeItemId: storeItemId,
        url: url,
        fileName: fileName,
        imagePath: imagePath,
        absolutePath: absolutePath
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
        return respondWithDBError(res, err);
      });
    } else {
      return respondWithInputError(res, "Image not uploaded", 400);
    }
  }

  deleteImage (req: Request, res: Response): Promise<Response> {
    const { _id: imgId, _store_item_id: storeItemId } = req.params;
    let deletedImage: IStoreItemImage;

    if (!imgId) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }

    return StoreItemImage.findOne({ _id: imgId })
      .then((storeItemImg) => {
        if (storeItemImg) {
          return deleteFile(storeItemImg.absolutePath)
            .then((success) => {
              if (success) {
                return StoreItemImage.findOneAndDelete({ _id: imgId })
                .then((image) => {
                  deletedImage = image!;
                  return StoreItem.findOneAndUpdate(
                    { _id: storeItemId },
                    { $pull: { images: imgId } },
                    { new: true }
                  ).populate("images").exec();
                })
                .then((updatedStoreItem) => {
                  return res.status(200).json({
                    responseMsg: "Image deleted",
                    deletedStoreItemImage: deletedImage,
                    updatedStoreItem: updatedStoreItem!
                  });
                })
                .catch((err) => {
                  console.error(err);
                  return respondWithDBError(res, err);
                });
              } else {
                return respondWithGeneralError(res, "Can't delete file", 500);
              }
            })
            .catch((err) => {
              return respondWithDBError(res, err);
            });
        } else {
          return respondWithInputError(res, "Image not found", 404);
        }
      });  
  }

}

export default StoreItemImageUploadController;