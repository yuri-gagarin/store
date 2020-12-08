import e, { Request, Response } from "express";
import { Types } from "mongoose";
import Product, { IProduct } from "../../models/Product";
import ProductImage, { IProductImage } from "../../models/ProductImage";
import { IGenericController } from "./../helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError, resolveStoreItemImgDirectories, resolveDirectoryOfImg, removeDirectoryWithFiles, respondWithNotAllowedErr } from "./../helpers/controllerHelpers";
import { IAdministrator } from "../../models/Administrator";
import { validateProductData } from "../products_controller/helpers/validationHelpers"; 
import { NotFoundError, ValidationError, NotAllowedError, processErrorResponse, GeneralError } from "../helpers/errorHandlers";

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

  getMany (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { name, price, date, limit }: ProducQueryPar = req.query;
    const queryLimit = limit ? parseInt(limit, 10) : 10;

    const admin = req.user as IAdministrator;
    if (admin) {
      if (!admin.businessAccountId) {
        return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "Create a Business Acccount or request to be added to one to get all features"]);
      }
    } else {
      return respondWithNotAllowedErr(res);
    }
    
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
    return Product.find({ businessAccountId: admin.businessAccountId })
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

  getOne (req: Request, res: Response<IGenericProdRes>): Promise<Response>  {
    const productId: string = req.params._id;
    const admin: IAdministrator = req.user as IAdministrator;
    // assert that an admin sent a product id //
    if (!productId) {
      return respondWithInputError(res, "Input error", 404, [ "Can't resolve product"]);
    }
    // assert that an admin exists and has a Business Account set up //
    if (admin) {
      if (!admin.businessAccountId) {
        return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "Create a Business Acccount or request to be added to one to get all features"]);
      }
    } else {
      return respondWithNotAllowedErr(res);
    }
    //
    return Product.findOne({ _id: productId })
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
    
    const admin: IAdministrator = req.user as IAdministrator;
    // assert that a user is present //
    if(!admin) {
      return respondWithGeneralError(res, "Cannot resolve user", 401);
    }
    // assert that an admin has a BusinessAccount set up //
    if (!admin.businessAccountId) {
      return respondWithInputError(res, "Account error", 401, [ "You must have or be tied to an account to create a Product "]);
    }
    // validate form input //
    const { valid, errorMessages } = validateProductData({ name, price, description, details });
    if(!valid) {
      return respondWithInputError(res, "Input eror", 422, errorMessages );
    }
    
    if (Array.isArray(productImages) && (productImages.length > 1)) {
      for (const newImg of productImages) {
        imgIds.push(Types.ObjectId(newImg.url));
      }
    }

    const newProduct = new Product({
      businessAccountId: admin.businessAccountId,
      name: name,
      description: description,
      details: details,
      price: price as number,
      images: [ ...imgIds ],
      createdAt: new Date(Date.now()),
      editedAt: new Date(Date.now())
    });

    return newProduct.save()
      .then((newProduct) => {
        return res.status(200).json({
          responseMsg: "New Product created",
          newProduct: newProduct
        });
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }

  edit (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { _id : productId } = req.params;
    const { name, description, details, price, images : productImages = [] }: ProductParams = req.body;
    const updatedProductImgs: Types.ObjectId[] = [];

    const admin: IAdministrator = req.user as IAdministrator;

    if (!productId) {
      return respondWithInputError(res, "Can't resolve Product", 400);
    }
    // ensure that a user has an account set up and that a user can edit this product //
    if(admin) {
      if(!admin.businessAccountId) {
        return respondWithInputError(res, "Account error", 401, [ "You must have or be tied to an account to update a Product" ]);
      }
    } else {
      return respondWithGeneralError(res, "Cannot resolve user", 401);
    }
    //
    // validate correct data //
    const { valid, errorMessages } = validateProductData({ name, price, description, details });
    if (!valid) {
      return respondWithInputError(res, "Input Error", 422, errorMessages);
    }
    //
    if (Array.isArray(productImages) && (productImages.length > 0)) {
      for (const img of productImages) {
        updatedProductImgs.push(img._id);
      }
    }

    return Product.findOne({ _id: productId })
      .then((product) => {
        
        if (product) {
          if (String(product.businessAccountId) === String(admin.businessAccountId)) {
            return Product.findOneAndUpdate(
              { _id: product._id },
              { $set: { 
                  name: name, 
                  price: (price as number),
                  description: description, 
                  details: details, 
                  editedAt: new Date(Date.now()), 
                  images: [ ...productImages ] 
                } 
              },
              { new: true }
            )
            .populate("images").exec();
          } else {
            throw new NotAllowedError("Updated not allowed", [ "Cannot update a Product which doesnt belong to your account "], 401);
          }
        } else {
          throw new NotFoundError("Not found", [ "Cannot resolve Product to update" ], 404);
        }
      })
      .then((editedProduct) => {
        return res.status(200).json({
          responseMsg: "Product updated",
          editedProduct: editedProduct!
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
  }

  delete (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    let deletedImages: number;
    let productImage: IProductImage;
    const productImagePaths: string[] = [];
    const productImageIds: string[] = [];
    const deletePromises: Promise<boolean>[] = [];

    const { _id: productId } = req.params;
    
    const admin: IAdministrator = req.user as IAdministrator;
    if (!admin) {
      return respondWithGeneralError(res, "Cannot resolve Admin", 401);
    }
   
    if (!productId) {
      return respondWithInputError(res, "Can't resolve Product");
    }

    return Product.findOne({ _id: productId })
      .populate({ path: "images", options: { limit: 1 } })
      .exec()
      .then((product) => {
        // first assert that a correct admin is deleting //
        if (product) {
          return Promise.resolve(product);
        } else {
          throw new NotFoundError("Not found", [ "Can't resolve Product to delete" ], 404);
        }
      })
      .then((product) => {
        if (String(product.businessAccountId) === String(admin.businessAccountId)) {
          // assuming the right account is deleting first resolve images //
          if (product.images.length > 0) productImage = (product.images[0] as IProductImage);
          return Promise.resolve();
        } else {
          throw new NotAllowedError("Operation not allowed", [ "Not allowed to delete a Product which does not belong to your Account" ], 401);
        }
      })
      .then((_) => {
        if (productImage && productImage.absolutePath) {
          const imagesDirectory = resolveDirectoryOfImg(productImage.absolutePath);
          return removeDirectoryWithFiles(imagesDirectory);
        } else {
          return Promise.resolve({ success: true, numberRemoved: 0, message: "No images" });
        }
      })
      .then((_) => {
        return ProductImage.deleteMany({ productId: productId }).exec();
      })
      .then(({ n }) => {
        n ? deletedImages = n : 0;
        return Product.findOneAndDelete({ _id: productId }).exec();
      })  
      .then((product) => {
        if (product) {
          return res.status(200).json({
            responseMsg: "Deleted the Product and " + deletedImages,
            deletedProduct: product
          });
        } else {
          throw new GeneralError("Something went very wrong", 500);
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
    
  }
}

export default ProductsController;