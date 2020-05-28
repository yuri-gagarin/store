import { Request, Response } from "express";
import { IGenericImgUploadCtrl } from './helpers/controllerInterfaces';
import { IImageUploadDetails } from "./image_uploaders/types/types";
import ProductImage, { IProductImage } from "../models/ProductImage";
// helpers //
import { respondWithInputError, respondWithDBError, normalizeImgUrl, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";
import Product, { IProduct } from "../models/Product";

type ProductImgRes = {
  responseMsg: string;
  newProductImage?: IProductImage;
  deletedProductImage?: IProductImage;
  updatedProduct: IProduct;
}

class ProductImageUploadController implements IGenericImgUploadCtrl {

  createImage (req: Request, res: Response<ProductImgRes>): Promise<Response> {
    const { _product_id: productId } = req.params;
    const uploadDetails: IImageUploadDetails = res.locals.uploadDetails as IImageUploadDetails;
    const { success, imagePath, fileName, absolutePath } = uploadDetails;
    let newImage: IProductImage;

    if (success && imagePath && absolutePath) {
      return normalizeImgUrl(absolutePath)
        .then((imgUrl) => {
          return ProductImage.create({
            productId: productId,
            url: imgUrl,
            fileName: fileName,
            imagePath: imagePath,
            absolutePath: absolutePath
          })
        .then((productImage) => {
          newImage = productImage;
          return Product.findOneAndUpdate(
            { _id: productId },
            { $push: { images: productImage._id } },
            { upsert: true, new: true }
          ).populate("images").exec();
        })
        .then((updatedProduct) => {
          return res.status(200).json({
            responseMsg: "Product image uploaded",
            newProductImage: newImage,
            updatedProduct: updatedProduct
          })  
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
    const { _id: imgId, _product_id: productId } = req.params;
    let deletedImage: IProductImage;

    if (!imgId) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }

    return ProductImage.findOne({ _id: imgId })
      .then((productImg) => {
        if (productImg) {
          return deleteFile(productImg.absolutePath)
            .then((success) => {
              if (success) {
                return ProductImage.findOneAndDelete({ _id: imgId })
                .then((image) => {
                  deletedImage = image!;
                  return Product.findOneAndUpdate(
                    { _id: productId },
                    { $pull: { images: imgId } },
                    { new: true }
                  ).populate("images").exec();
                })
                .then((updatedProduct) => {
                  return res.status(200).json({
                    responseMsg: "Image deleted",
                    deletedProductImage: deletedImage,
                    updatedProduct: updatedProduct!
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