import { Request, Response } from "express";
import { Types } from "mongoose";
import Product, { IProduct } from "../models/Product";
import ProductImage, { IProductImage } from "../models/ProductImage";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";

interface IGenericProdRes {
  responseMsg: string;
  newProduct?: IProduct;
  editedProduct?: IProduct;
  deletedProduct?: IProduct;
  product?: IProduct;
  products?: IProduct[];
}
export type ProductParams = {
  name: string;
  description: string;
  details: string;
  price: string | number;
  images: IProductImage[];
}
type ProducQueryPar = {
  price?: string;
  date?: string;
  name?: string;
  limit?: string;
}

class ProductsController implements IGenericController {

  index (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { name, price, date, limit }: ProducQueryPar = req.query;
    const queryLimit = limit ? parseInt(limit, 10) : 10;
    // optional queries //
    // sort by price //
    if (price) {
      return (
        Product.find({})
          .sort({ price: price }).limit(queryLimit)
          .populate("images").exec()
      )
      .then((products) => {
        return res.status(200).json({
          responseMsg: `Loaded ${products.length} Products and sorted by price ${price.toUpperCase()}`,
          products: products
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
    }
    // sort by date //
    if (date) {
      return (
        Product.find({})
          .sort({ createdAt: date }).limit(queryLimit)
          .populate("images").exec()
      )
      .then((products) => {
        return res.status(200).json({
          responseMsg: `Loaded ${products.length} Products and sorted by date ${date.toUpperCase()}`,
          products: products
        });
      });
    }
    // sort by name //
    if (name) {
      return (
        Product.find({})
          .sort({ name: name }).limit(queryLimit)
          .populate("images").exec()
      )
      .then((products) => {
        return res.status(200).json({
          responseMsg: `Loaded ${products.length} Producsts and sorted alphabetically ${name.toUpperCase()}`,
          products: products
        });
      });
    }
    // general response //
    return Product.find({})
      .limit(queryLimit).populate("images").exec()
      .then((products) => {
        return res.status(200).json({
          responseMsg: `Loaded ${products.length} products`,
          products: products
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }

  get (req: Request, res: Response<IGenericProdRes>): Promise<Response>  {
    const _id: string = req.params._id;
    if (!_id) return respondWithInputError(res, "Can't find product");
   
    return Product.findOne({ _id: _id })
      .populate("images").exec()
      .then((product) => {
        if (product) {
          return res.status(200).json({
            responseMsg: "Returned product",
            product: product
          });
        } else {
          return respondWithInputError(res, "Could not find Product", 404);
        }
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }

  create (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { name, description, details, price, images : productImages }: ProductParams = req.body;
    const imgIds: Types.ObjectId[] = [];

    if (Array.isArray(productImages) && (productImages.length > 1)) {
      for (const newImg of productImages) {
        imgIds.push(Types.ObjectId(newImg.url));
      }
    }

    const newProduct = new Product({
      name: name,
      description: description,
      details: details,
      price: price as number,
      images: [ ...imgIds ]
    });

    return newProduct.save()
      .then((newProduct) => {
        return res.status(200).json({
          responseMsg: "New Product created",
          newProduct: newProduct
        });
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      });
  }

  edit (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { _id } = req.params;
    const { name, description, details, price, images : productImages }: ProductParams = req.body;
    const updatedProductImgs: Types.ObjectId[] = [];

    if (!_id) {
      return respondWithInputError(res, "Can't resolve Product", 400);
    }
    if (Array.isArray(productImages) && (productImages.length > 0)) {
      for (const img of productImages) {
        updatedProductImgs.push(img._id);
      }
    }

    return Product.findOneAndUpdate(
      { _id: _id },
      { 
        $set: {
          name: name,
          description: description,
          details: details,
          price: price as number,
          images: [ ...updatedProductImgs ],
          editedAt: new Date()
        },
      },
      { new: true }
     ).populate("images").exec()
      .then((editedProduct) => {
        return res.status(200).json({
          responseMsg: "Product updated",
          editedProduct: editedProduct!
        });
      })
      .catch((error) => {
        console.error(error);
        return respondWithDBError(res, error);
      });
       
  }

  delete (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
   const { _id } = req.params;

   let deletedImages: number;
   const productImagePaths: string[] = [];
   const productImageIds: string[] = [];
   const deletePromises: Promise<boolean>[] = [];

   if (!_id) {
     return respondWithInputError(res, "Can't resolve Product");
   }

   return Product.findOne({ _id: _id})
    .populate("images")
    .then((product) => {
      // first delete all Product images //
      if (product) {
        for (const image of product.images) {
          const img = image as IProductImage;
          productImagePaths.push(img.absolutePath);
          productImageIds.push(img._id);
        }
        for (const path of productImagePaths) {
          deletePromises.push(deleteFile(path));
        }
        return Promise.all(deletePromises)
          .then(() => {
            return ProductImage.deleteMany({ _id: { $in: [ ...productImageIds ] } })
              .then(({ n }) => {
                n ? deletedImages = n : 0;
                return Product.findOneAndDelete({ _id: _id });
              })
              .then((product) => {
                if (product) {
                  return res.status(200).json({
                    responseMsg: "Deleted the Product and " + deletedImages,
                    deletedProduct: product
                  });
                }
                else {
                  return respondWithDBError(res, new Error("Can't resolve delete"));
                }
                
              })
              .catch((error) => {
                return respondWithDBError(res, error);
              });
          })
          .catch((err: Error) => {
            return respondWithGeneralError(res, err.message, 400);
          });
      } else {
        return respondWithInputError(res, "Can't find Product to delete");
      }
    });
  }

}

export default ProductsController;