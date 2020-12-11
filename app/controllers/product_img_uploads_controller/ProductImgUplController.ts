import { Request, Response } from "express";
// models and model interfaces //
import { IGenericImgUploadCtrl } from '../helpers/controllerInterfaces';
import Product from "../../models/Product";
import ProductImage, { IProductImage } from "../../models/ProductImage";
// additional types //
import { ProductImgRes } from "./type_declarations/productImgUpldsContrllerTypes";
// helpers //
import { respondWithInputError, respondWithDBError, normalizeImgUrl, deleteFile, respondWithGeneralError } from "../helpers/controllerHelpers";
import { IImageUploadDetails } from "../image_uploaders/types/types";
import { IAdministrator } from "../../models/Administrator";
import { GeneralError, NotFoundError, processErrorResponse } from "../helpers/errorHandlers";



class ProductImageUploadController implements IGenericImgUploadCtrl {

  createImage (req: Request, res: Response<ProductImgRes>): Promise<Response> {
    const { businessAccountId } = (req.user as IAdministrator);
    const { _product_id: productId } = req.params;

    const uploadDetails: IImageUploadDetails = res.locals.uploadDetails as IImageUploadDetails;
    const { success, imagePath, fileName, absolutePath, url } = uploadDetails;
    let newImage: IProductImage;

    if (success) {
      return ProductImage.create({
        businessAccountId: businessAccountId,
        productId: productId,
        url: url,
        fileName: fileName,
        imagePath: imagePath,
        absolutePath: absolutePath
      })
      .then((productImage) => {
        newImage = productImage;
        return (
          Product.findOneAndUpdate(
            { _id: productId },
            { $push: { images: productImage._id } },
            { upsert: true, new: true }
          )
          .populate("images").exec()
        );
      })
      .then((updatedProduct) => {
        return res.status(200).json({
          responseMsg: "Product image uploaded",
          newProductImage: newImage,
          updatedProduct: updatedProduct
        });
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
    } else {
      return respondWithInputError(res, "Something went wrong", 500, [ "Image not uploaded"] );
    }
  }

  deleteImage (req: Request, res: Response): Promise<Response> {
    const { _id: imgId, _product_id: productId } = req.params;
    let deletedImage: IProductImage;

    if (!imgId) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }

    return ProductImage.findOne({ _id: imgId })
      .then((productImg) => {
        if (productImg) {
          return deleteFile(productImg.absolutePath);
        } else {
          throw new NotFoundError({ messages: [ "Image to delete was not found" ] });
        }
      })

      .then((success) => {
        if (success) {
          return ProductImage.findOneAndDelete({ _id: imgId }).exec();
        } else {
          throw new GeneralError("Could not delete image", 500);
        }
      })
      .then((image) => {
        deletedImage = image!;
        return (
          Product.findOneAndUpdate(
            { _id: productId },
            { $pull: { images: imgId } },
            { new: true }
          )
          .populate("images").exec()
        );
      })
      .then((updatedProduct) => {
        if (updatedProduct) {
          return res.status(200).json({
            responseMsg: "Image deleted",
            deletedProductImage: deletedImage,
            updatedProduct: updatedProduct!
          });
        } else {
          throw new NotFoundError({ messages: [ "Seems like we could not resolve a Product to update" ] });
        }
      })
      .catch((err) => {
        console.error(err);
        return processErrorResponse(res, err);
      });
  }

};

export default ProductImageUploadController;