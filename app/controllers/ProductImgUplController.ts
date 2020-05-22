import { Request, Response } from "express";
import { IGenericImgUploadCtrl } from './helpers/controllerInterfaces';
import { IImageUploadDetails } from "./image_uploaders/types/types";
import ProductPicture from "../models/ProductPicture";
// helpers //
import { respondWithInputError, respondWithDBError, normalizeImgUrl, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";

class ProductImageUploadController implements IGenericImgUploadCtrl {
  createImage (req: Request, res: Response): Promise<Response> {
    const uploadDetails: IImageUploadDetails = res.locals.uploadDetails as IImageUploadDetails;
    const { success, imagePath, fileName, absolutePath } = uploadDetails;
    if (success && imagePath && absolutePath) {
      return normalizeImgUrl(absolutePath)
        .then((imgUrl) => {
          return ProductPicture.create({
            url: imgUrl,
            fileName: fileName,
            imagePath: imagePath,
            absolutePath: absolutePath
          })
        .then((productPic) => {
          return res.status(200).json({
            responseMsg: "Store image uploaded",
            image: productPic
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
    return ProductPicture.findOne({ _id: _id})
      .then((productPic) => {
        if (productPic) {
          return deleteFile(productPic.absolutePath)
            .then((success) => {
              if (success) {
                return ProductPicture.findOneAndDelete({ _id: _id})
                .then(() => {
                  return res.status(200).json({
                    responseMsg: "Image deleted"
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

export default ProductImageUploadController;