import { Request, Response } from "express";
import { IGenericImgUploadCtrl } from './helpers/controllerInterfaces';
import { IImageUploadDetails } from "./image_uploaders/StoreImageUploader";
import StorePicture from "../models/StorePicture";
// helpers //
import { respondWithInputError, respondWithDBError, normalizeImgUrl } from "./helpers/controllerHelpers";

class StoreImageUploadController implements IGenericImgUploadCtrl {
  createImage (req: Request, res: Response): Promise<Response> {
    const uploadDetails: IImageUploadDetails = res.locals.uploadDetails;
    const { imagePath, success } = uploadDetails;
    if (success && imagePath) {
      return normalizeImgUrl(uploadDetails.imagePath)
        .then((imgUrl) => {
          return StorePicture.create({
            url: imgUrl,
            uploadPAth: imagePath
          })
        .then((storeImg) => {
          return res.status(200).json({
            responseMsg: "Image uploaded",
            imgUrl: storeImg.url,
            uploadPath: storeImg.uploadPath
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
  deleteImage (req: Request, res: Response): Promise<Response> {
    const { _id } = req.params;
    if (!_id) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }
    return StorePicture.findOne({ _id: _id})
      .then((storePic) => {
        return StorePicture.deleteOne({ _id: storePic?._id})
      })
      .then((result) => {
        return res.status(200).json({
          responeMsg: "Deleted " + result.deletedCount + " image(s)"
        });
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      });
  }
}

export default StoreImageUploadController;