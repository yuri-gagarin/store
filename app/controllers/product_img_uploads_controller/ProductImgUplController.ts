import { Request, Response } from "express";
// models and model interfaces //
import { IAdministrator } from "../../models/Administrator";
import { IGenericImgUploadCtrl } from '../_helpers/controllerInterfaces';
import Product from "../../models/Product";
import ProductImage, { IProductImage } from "../../models/ProductImage";
// additional types //
import { ProductImgRes } from "./type_declarations/productImgUpldsControllerTypes";
// helpers //
import { respondWithInputError, deleteFile } from "../_helpers/controllerHelpers";
import { IImageUploadDetails } from "../image_uploaders/types/types";
import { GeneralError, NotFoundError, processErrorResponse } from "../_helpers/errorHandlers";

/**
 * NOTES 
 * When either <createImage> or <deleteImage> action of the 'ProductImgUploadsController' gets 
 * called, the <passport.authenticate> and <checkImgUploadCredentials> middlewares should have 
 * been run. 
 * The 'ProductImgUploadsController' assumes the following: 
 * 1: The Admin has been authenticated and logged in 
 * 2: <req.user> as IAdministrator 'object' exists 
 * 3: <req.user.businessAccountId> property exists
 * 4: <req.user.businessAccountId> === <service.businessAccoundId 
 * 
 * VALID RESPONSE should include: 
 * {
 *    responseMsg: string;
 *    newProductImage: IProductImage;
 *    updatedProduct: IProduct;
 * }
 * 
 * INVALID RESPONSE should include:
 * {
 *    reponseMsg: string;
 *    error: 'object' | Error;
 *    errorMessages: string[];
 * }
 */

class ProductImageUploadController implements IGenericImgUploadCtrl {

  createImage (req: Request, res: Response<ProductImgRes>): Promise<Response> {
    const { businessAccountId } = (req.user as IAdministrator);
    const { success, imagePath, fileName, absolutePath, url } = res.locals.uploadDetails as IImageUploadDetails;
    const { productId } = req.params;

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
            { businessAccountId: businessAccountId, _id: productId },
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
    const {  productImgId, productId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;

    let deletedImage: IProductImage;

    if (!productId && !productImgId) {
      return respondWithInputError(res, "Not Found", 404, [ "Could not resolve Product Image to delete" ]);
    }

    return (
      ProductImage.findOne(
        { businessAccountId: businessAccountId, _id: productImgId }
      ).exec()
    )
    .then((productImg) => {
      if (productImg) {
        return deleteFile(productImg.absolutePath);
      } else {
        throw new NotFoundError({ 
          errMessage: "Coudn't delete Product Image", 
          messages: [ "Requested Product Image was not found in the database" ]
        });
      }
    })
    .then((_) => {
      return ProductImage.findOneAndDelete({ businessAccountId: businessAccountId, _id: productImgId }).exec();
    })
    .then((image) => {
      if (image) {
        deletedImage = image;
        return (
          Product.findOneAndUpdate(
            { businessAccountId: businessAccountId, _id: productId },
            { $pull: { images: productImgId } },
            { new: true }
          )
          .populate("images").exec()
        );
      } else {
        throw new NotFoundError({
          errMessage: "Queried Image not found",
          messages: [ "Could not find queried Image in the database to delete" ]
        });
      }
    })
    .then((updatedProduct) => {
      if (updatedProduct) {
        return res.status(200).json({
          responseMsg: "Image deleted",
          deletedProductImage: deletedImage,
          updatedProduct: updatedProduct
        });
      } else {
        throw new NotFoundError({
          errMessage: "Queried Product not found",
          messages: [ "Could not find queried Product in the database to update" ]
        });
      }
    })
    .catch((err) => {
      return processErrorResponse(res, err);
    });
  }

};

export default ProductImageUploadController;