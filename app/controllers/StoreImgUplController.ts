import { Request, Response } from "express";
import { IGenericImgUploadCtrl } from './helpers/controllerInterfaces';
import { IImageUploadDetails } from "./image_uploaders/types/types";
import StorePicture, { IStorePicture } from "../models/StorePicture";
// helpers //
import { respondWithInputError, respondWithDBError, normalizeImgUrl, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";
import Store, { IStore } from "../models/Store";

type ImageReqestObj = {
  _store_id: string;
}
type StoreImageResponse = {
  responseMsg: string;
  newStoreImage?: IStorePicture;
  deletedStoreImage?: IStorePicture;
  updatedStore: IStore;
}
class StoreImageUploadController implements IGenericImgUploadCtrl {
  createImage (req: Request, res: Response<StoreImageResponse>): Promise<Response> {
    const { _store_id: storeId } = req.params;
    const uploadDetails: IImageUploadDetails = res.locals.uploadDetails as IImageUploadDetails;
    const { success, imagePath, fileName, absolutePath } = uploadDetails;
    let newImage: IStorePicture;

    if (success && imagePath && absolutePath) {
      return normalizeImgUrl(absolutePath)
        .then((imgUrl) => {
          return StorePicture.create({
            storeId: storeId,
            url: imgUrl,
            fileName: fileName,
            imagePath: imagePath,
            absolutePath: absolutePath
          })
        .then((storeImage) => {
          newImage = storeImage;
          return Store.findOneAndUpdate(
            { _id: storeId },
            { $push: { images: storeImage._id } },
            { upsert: true, new: true }
          ).populate("images").exec();
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
      });
    } else {
      return respondWithInputError(res, "Image not uploaded", 400);
    }
  }
  deleteImage (req: Request, res: Response<StoreImageResponse>): Promise<Response> {
    const { _id: imgId, _store_id: storeId } = req.params;
    let deletedImage: IStorePicture;
    console.log(61)
    if (!imgId) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }
    return StorePicture.findById(imgId)
      .then((storePic) => {
        if (storePic) {
          return deleteFile(storePic.absolutePath)
            .then(() => {
              return StorePicture.findOneAndDelete({ id: imgId })
            })
            .then((image) => {
              deletedImage = image!;
              return Store.findOneAndUpdate(
                { _id: storeId },
                { $pull: { images: imgId }},
                { new: true }
              ).populate("images").exec()
            })
            .then((updatedStore) => {
              return res.status(200).json({
                responseMsg: "Image deleted",
                deletedStoreImage: deletedImage,
                updatedStore: updatedStore!
              });
            })
            .catch((err) => {
              console.error(err);
              return respondWithDBError(res, err);
            });
          } else {
            return respondWithGeneralError(res, "Message", 400)
          }
        })
        .catch((err) => {
          return respondWithDBError(res, err);
        })
  }
  /*
  private parallelQuery (): Promise<boolean> {
    return new Promise((resolve, reject) => {

    })
  }
  */
}

export default StoreImageUploadController;