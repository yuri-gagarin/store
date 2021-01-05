import { Request, Response } from "express";
import { Types } from "mongoose";
// models and model interfaces //
import Product, { IProduct } from "../../models/Product";
import ProductImage, { IProductImage } from "../../models/ProductImage";
import { IGenericController } from "../_helpers/controllerInterfaces";
// additional controller types and interfaces //
import { ProductData, IGenericProdRes, ProducQueryPar } from "./type_declarations/productsControllerTypes";
// helpers //
import { respondWithDBError, respondWithInputError, respondWithGeneralError, resolveDirectoryOfImg, removeDirectoryWithFiles, respondWithNotAllowedErr } from "../_helpers/controllerHelpers";
import { IAdministrator } from "../../models/Administrator";
import { validateProductData } from "../products_controller/helpers/validationHelpers"; 
import { NotFoundError, NotAllowedError, processErrorResponse, GeneralError } from "../_helpers/errorHandlers";
import BusinessAccount from "../../models/BusinessAccount";

/**
 *  NOTES
 * By the time any of the 'ProductsController' methods are called some of the 
 * following is assumed. <Router> should process some custom middleware
 * including <verifyAdminAndBusinessAccountId> OR <verifyDataModelAccess> OR BOTH!
 * By the time any 'ProductsController' methods are called, it is assumed that:
 * 1: <req.user> is defined as 'IAdministrator' model instance
 * 2: <req.user.businessAccountId> is defined for GET_MANY and CREATE methods
 * 3: <req.user.businessAccountId> === <product.businessAcccountID> for GET_ONE, EDIT and DELETE methods
 * 
 */

class ProductsController implements IGenericController {

  getMany (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { name, price, date, limit }: ProducQueryPar = req.query;
    const { businessAccountId } = req.user as IAdministrator;
    const queryLimit = limit ? parseInt(limit, 10) : 10;
   
    // optional queries //
    // sort by price //
    if (price) {
      return (
        Product.find({ businessAccountId: businessAccountId })
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
        Product.find({ businessAccountId: businessAccountId })
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
    return Product.find({ businessAccountId: businessAccountId })
      .limit(queryLimit)
      .populate({ path: "images", options: { limit: 1 } })
      .exec()
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
    const { businessAccountId } = req.user as IAdministrator;
    const { productId } = req.params;

    return (
      Product.findOne({ businessAccountId: businessAccountId, _id: productId })
        .populate({ path: "images" })
        .exec()
    )
    .then((product) => {
      if (product) {  
        return res.status(200).json({
          responseMsg: "Returned product",
          product: product
        });
      } else {
        throw new NotFoundError({
          messages: [ "Could not find the queried Product" ]
        })
      }
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
  }

  create (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { name, description, details, price }: ProductData = req.body;    
    const { businessAccountId }: IAdministrator = req.user as IAdministrator;
    let createdProduct: IProduct;
    // assert that a user is present //
    
    // validate form input //
    const { valid, errorMessages } = validateProductData({ name, price, description, details });
    if(!valid) {
      return respondWithInputError(res, "Input eror", 422, errorMessages );
    }

    const newProduct = new Product({
      businessAccountId: businessAccountId,
      name: name,
      description: description,
      details: details,
      price: price as number,
      images: [],
      createdAt: new Date(Date.now()),
      editedAt: new Date(Date.now())
    });

    return newProduct.save()
      .then((product) => {
        createdProduct = product;
        const productId  = createdProduct._id as Types.ObjectId;
        return BusinessAccount.findOneAndUpdate(
          { _id:  businessAccountId },
          { $push: { linkedProducts: productId } }
        );
      })
      .then((updatedaccount) => {
        return res.status(200).json({
          responseMsg: "New Product created",
          newProduct: createdProduct
        });
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }

  edit (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { productId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;
    const { name, description, details, price, images : productImages = [] }: ProductData = req.body;
    
    // validate correct data //
    const { valid, errorMessages } = validateProductData({ name, price, description, details });
    if (!valid) {
      return respondWithInputError(res, "Input Error", 422, errorMessages);
    }
    //

    return (
      Product.findOneAndUpdate(
        { businessAccountId: businessAccountId, _id: productId },
        { $set: { 
            name: name, 
            price: (price as number),
            description: description, 
            details: details, 
            editedAt: new Date(Date.now()), 
          }
        },
        { new: true }
      )
      .populate("images")
      .exec()
    )
    .then((updatedProduct) => {
      if (updatedProduct) {
        return res.status(200).json({
          responseMsg: "Product successfuly updated",
          editedProduct: updatedProduct
        });
      } else {
        throw new NotFoundError({
          errMessage: "Product update error",
          messages: [ "Could not resolved the queried Product to update" ]
        });
      }
    })
    .catch((error) => {
      return processErrorResponse(res, error);
    });
  }

  delete (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { businessAccountId } = req.user as IAdministrator;
    const { productId } = req.params;
    let deletedProduct: IProduct;
    let productImage: IProductImage;
    let numOfImagesDeleted: number = 0;
    // ensure that an admin is present with a business account //
  
    return (
      Product.findOne({ businessAccountId: businessAccountId, _id: productId })
        .populate({ path: "images", model: "ProductImage", options: { limit: 1 } })
        .exec()
    )
    .then((product) => {
      // first assert that a correct admin is deleting //
      if (product) {
        return Promise.resolve(product);
      } else {
        throw new NotFoundError({ messages: [ "Can't resolve Product to delete" ] });
      }
    })
    .then((product) => {
      if (product.images.length > 0) { 
          productImage = (product.images[0] as IProductImage);
        return removeDirectoryWithFiles(productImage.imagePath);
      } else {
        return Promise.resolve({ success: true, numberRemoved: 0 });
      }
    })
    .then(({ numberRemoved }) => {
      if (numberRemoved > 0) {
        return ProductImage.deleteMany({ productId: productId }).exec();
      } else {
        return Promise.resolve({ response: { ok: true, n: 0 }, deletedCount: 0 })
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) numOfImagesDeleted = deletedCount;
      return (
        Product.findOneAndDelete({ 
          businessAccountId: businessAccountId, _id: productId 
        })
        .exec()
      );
    })  
    .then((product) => {
      if (product) {
        deletedProduct = product;
        return BusinessAccount.findOneAndUpdate(
          { _id: businessAccountId },
          { $pull: { linkedProducts: product._id } }
        ).exec()
      } else {
        throw new GeneralError("Something went very wrong", 500);
      }
    })
    .then((_) => {
      return res.status(200).json({
        responseMsg: `Removed Product`,
        deletedProduct: deletedProduct
      })
    })
    .catch((err) => {
      return processErrorResponse(res, err);
    });
  }
}

export default ProductsController;