import { Request, Response } from "express";
import { Types } from "mongoose";
// models and model interfaces //
import { IAdministrator } from "../../models/Administrator";
import { IGenericController } from "../_helpers/controllerInterfaces"
import BusinessAccount,  { EAccountLevel, IBusinessAccount } from "../../models/BusinessAccount";
import Store from "../../models/Store";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import StoreItem from "../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../models/StoreItemImage";
import Product from "../../models/Product";
import ProductImage, { IProductImage } from "../../models/ProductImage";
import Service from "../../models/Service";
import ServiceImage, { IServiceImage } from "../../models/ServiceImage";
// controller types and interfaces //
import {
  BusinessAccountsContReqParams, BusinessAccountsContRes, 
  BusinessAccountsIndexSortQuery, CreateBusAccountBodyReq, EditAccountBodyReq
} from "./type_declarations/businessAccoountsContTypes";
// helpers //
import { removeDirectoryWithFiles, RemoveResponse, resolveDirectoryOfImg, respondWithDBError, respondWithGeneralError, respondWithInputError, rejectWithGenError } from "../_helpers/controllerHelpers";


class BusinessAccountsController implements IGenericController {

  getMany(req: Request<{}, {}, {}, BusinessAccountsIndexSortQuery>, res: Response<BusinessAccountsContRes>): Promise<Response> {
    const user = req.user as IAdministrator;
    const { createdAt, editedAt, accountLevel, limit } = req.query;
    if (!user) {
      return respondWithGeneralError(res, "Cant resolve current user", 401);
    }

    if (createdAt || editedAt || accountLevel) {
      let sortOption: any = {};
      let sortType: string; 
      if (createdAt) {
        sortType = "Date Created";
        sortOption.createdAt = createdAt;
      } 
      if (editedAt) {
        sortType = "Date Edited"
        sortOption.editedAt = editedAt;
      }
      if (accountLevel) {
        sortType = "Account Level"
        sortOption.accountLevel = accountLevel
      }
      
      return BusinessAccount.find({})
        .sort(sortOption)
        .limit(limit ? parseInt(limit, 10) : 10)
        .populate({ path: "linkedAdmins", model: "administrator" })
        .populate({ path: "linkedStores", model: "store", select: "-images" })
        .populate({ path: "linkedServices", model: "service", select: "-images" })
        .populate({ path: "linkedProducts", model: "product", select: "-images" })
        .exec()
        .then((businessAccounts) => {
          return res.status(200).json({
            responseMsg: `Fetched ${businessAccounts.length} admins. Sorted by ${sortType} created ${createdAt}`,
            businessAccounts: businessAccounts
          });
        })  
        .catch((err) => respondWithDBError(res, err));
    }
    return BusinessAccount.find({})
      .sort({ createdAt: "desc "})
      .limit(10)
      .populate({ path: "linkedAdmins", model: "administrator" })
      .populate({ path: "linkedStores", model: "store", select: "-images" })
      .populate({ path: "linkedServices", model: "service", select: "-images" })
      .populate({ path: "linkedProducts", model: "product", select: "-images" })
      .exec()
      .then((businessAccounts) => {
        return res.status(200).json({
          responseMsg: `Fetched ${businessAccounts.length} admins. Sorted by Date Created DESC`,
          businessAccounts: businessAccounts
        });
      })   
      .catch((err) => respondWithDBError(res, err)); 
  }

  getOne(req: Request, res: Response<BusinessAccountsContRes>): Promise<Response> {
    const { businessAccountId } = req.params as BusinessAccountsContReqParams ;
    if (!businessAccountId) {
      return respondWithInputError(res, "Cant resolve an account to look for", 422);
    }
    return BusinessAccount.findOne({ _id: businessAccountId })
      .populate({ path: "linkedAdmins", model: "administrator" })
      .populate({ path: "linkedStores", model: "store", select: "-images" })
      .populate({ path: "linkedServices", model: "service", select: "-images" })
      .populate({ path: "linkedProducts", model: "product", select: "-images" })
      .exec()
      .then((businessAccount) => {
        if (businessAccount) {
          return res.status(200).json({
            responseMsg: `Account with id of ${businessAccountId}`,
            businessAccount: businessAccount
          })
        } else {
          return respondWithGeneralError(res, "Could not find an account", 404);
        }
      })
      .catch((err) => respondWithDBError(res, err));
  }

  create(req: Request, res: Response): Promise<Response> {
    const admin = req.user as IAdministrator;
    const { _id: adminId } = admin;
    if (admin.adminAccountId) {
      return respondWithGeneralError(res, "You already have an account set up", 422);
    }
    return BusinessAccount.create({ 
      adminAccounts: [ adminId ],
      linkedStores: [],
      linkedServices: [],
      accountLevel: EAccountLevel.Standard
    })
    .then((adminAccount) => {
      return res.status(200).json({
        responseMsg: "Created a new admin account",
        newBusinessAcccount: adminAccount
      });
    })
    .catch((err) => respondWithDBError(res, err));
  } 

  edit(req: Request<{}, {},EditAccountBodyReq>, res: Response<BusinessAccountsContRes>): Promise<Response> {
    const { businessAccountId } = req.params as BusinessAccountsContReqParams;
    const { linkedBusinesss, linkedStores, linkedServices, accountLevel } = req.body;
    if (businessAccountId) {
      return respondWithInputError(res, "Cannot resolve account to edit", 422);
    }

    return BusinessAccount.findOneAndUpdate(
      { _id: businessAccountId },
      { 
        linkedBusinesss: [ ...linkedBusinesss ],
        linkedStores: [ ...linkedStores ],
        linkedServices: [ ...linkedServices ],
        accountLevel: accountLevel ? parseInt(accountLevel, 10) : 0,
        editedAt: new Date(Date.now())
      },
      {
        new: true
      }
    )
    .then((updatedAccount) => {
      if (updatedAccount) {
        return res.status(200).json({
          responseMsg: `Updated account ${updatedAccount._id}`,
          editedBusinessAccount: updatedAccount
        })
      } else {
        return respondWithGeneralError(res, "Could not find the account to update", 404);
      }
    })
    .catch((err) => respondWithDBError(res, err));
  }

  delete(req: Request, res: Response<BusinessAccountsContRes>): Promise<Response> {
    console.log("called")
    const { businessAccountId } = req.params as BusinessAccountsContReqParams;
    const storeImgDirectories: string[] = [];
    const storeItemImgDirectories: string[] = []
    const serviceImgDirectories: string[] = [];
    const productImgDirectories: string[] = [];
    // 
    let deletedAccount: IBusinessAccount;
    //
    let linkedStores: Types.ObjectId[];
    let storeItemIds: Types.ObjectId[];
    let linkedServices: Types.ObjectId[];
    let linkedProducts: Types.ObjectId[];
    // 
    let numOfStoresDeleted: number = 0;
    let numOfStoreImagesDeleted: number = 0;
    let numOfStoreItemsDeleted: number = 0;
    let numOfStoreItemImagesDeleted: number = 0;
    let numOfServicesDeleted: number = 0;
    let numOfServiceImagesDeleted: number = 0;
    let numOfProductsDeleted: number = 0;
    let numOfProductImagesDeleted: number = 0;

    if (!businessAccountId) {
      return respondWithInputError(res, "Cannot resolve account to delete", 422);
    }
    return BusinessAccount.findOneAndDelete({ _id: businessAccountId })
      .then((adminAccount) => {
        if(adminAccount) { 
          deletedAccount = adminAccount;
          // delete the admin acccount check for stores and services //
          linkedStores = adminAccount.linkedStores as Types.ObjectId[];
          linkedServices = adminAccount.linkedServices as Types.ObjectId[];
          if(linkedStores.length > 0) {
            return Store.find({ _id: { $in: linkedStores } })
              .populate("images").exec();
          } else {
            return Promise.resolve(null);
          }
        } else {
          return rejectWithGenError(res, "Unable to resolve account", 404);
        }
      })
      .then((foundStores) => {
        if (foundStores && (foundStores.length > 0)) {
          // stores found // 
          // set the image directories to delete then remove stores from database //
          for (const store of foundStores) {
            if (store.images.length > 0) {
              const imgDirectory = (store.images[0] as IStoreImage).absolutePath;
              storeImgDirectories.push(resolveDirectoryOfImg(imgDirectory));
            }
          }
          return Store.deleteMany({ _id: { $in: linkedStores } }).exec();
        } else {
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ ok, n }) => {
        // delete store images if any //
        // check if actual store images to delete //
        if (ok && n && (n > 0) && (storeImgDirectories.length > 0)) {
          numOfStoresDeleted = n;
          return StoreImage.deleteMany({ storeId: { $in: linkedStores } });
        } else {
          numOfStoresDeleted = n!;
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ ok, n }) => {
        const storeImgDeletePromises: Promise<RemoveResponse>[] = [];
        // remove store images from files if any were deleted from db //
        if (ok && n && (n > 0) && (storeImgDirectories.length > 0)) {
          numOfStoreImagesDeleted = n;
          for (const storeImgDirectory of storeImgDirectories) {
            storeImgDeletePromises.push(removeDirectoryWithFiles(storeImgDirectory));
          }
          return Promise.all(storeImgDeletePromises);
        } else {
          numOfStoresDeleted = n ? n : 0;
          return Promise.resolve([]);
        }
      })
      .then((_) => {
        // check for storeItems to delete //
        if (linkedStores.length > 0) {
          return StoreItem.find({ storeId: { $in: linkedStores } })
            .populate("images").exec();
        } else {
          return Promise.resolve(null);
        }
      })
      .then((storeItems) => {
        if (storeItems && (storeItems.length > 0)) {
          for (const storeItem of storeItems) {
            storeItemIds.push(storeItem._id);
            if (storeItem.images.length > 0) {
              const absolutePath = (storeItem.images[0] as IStoreItemImage).absolutePath;
              storeItemImgDirectories.push(resolveDirectoryOfImg(absolutePath));
            }
          }
          return StoreItem.deleteMany({ storeId: { $in: linkedStores } });
        } else {
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ ok, n }) => {
        if (ok && n && (n > 0) && (storeItemImgDirectories.length > 0)) {
          numOfStoresDeleted = n;
          return StoreItemImage.deleteMany({ storeItemId: { $in: storeItemIds } });
        } else {
          numOfStoreItemsDeleted = n ? n : 0;
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0});
        }
      })
      .then(({ ok, n }) => {
        // delete store item images from directories if any //
        const storeItemImgDelPromises: Promise<RemoveResponse>[] = []
        if (ok && n && (n > 0) && (storeItemImgDirectories.length > 0)) {
          numOfStoreImagesDeleted = 0;
          for (const storeItemImgDir of storeItemImgDirectories) {
            storeItemImgDelPromises.push(removeDirectoryWithFiles(storeItemImgDir));
          }
          return Promise.all(storeItemImgDelPromises);
        } else {
          numOfStoreItemImagesDeleted = n ? n : 0;
          return Promise.all([]);
        }
      })
      .then((_) => {
        // deal with account's services if any //
        if (linkedServices.length > 0) {
          return Service.find({_id: { $in: { linkedServices } } })
            .populate("images").exec();
        } else {
          return Promise.resolve(null)
        }
      })
      .then((services) => {
        if (services && (services.length > 0)) {
          for (const service of services) {
            if (service.images.length > 0) {
              const absolutePath = (service.images[0] as IServiceImage).absolutePath;
              serviceImgDirectories.push(resolveDirectoryOfImg(absolutePath));
            }
          }
          return Service.deleteMany({ _id: { $in: { linkedServices } }});
        } else {
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ ok, n }) => {
        if (ok && n && (n > 0) && (serviceImgDirectories.length > 0)) {
          numOfServicesDeleted = n;
          return ServiceImage.deleteMany({ serviceId: { $in: linkedServices } });
        } else {
          numOfStoreImagesDeleted = n ? n : 0;
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ ok, n }) => {
        const serviceImgDeletePromises: Promise<RemoveResponse>[] = [];
        if (ok && n && (n > 0)) {
          numOfServiceImagesDeleted = n;
          for (const imgDirectory of serviceImgDirectories) {
            serviceImgDeletePromises.push(removeDirectoryWithFiles(imgDirectory));
          }
          return(serviceImgDeletePromises);
        } else {
          numOfServiceImagesDeleted = n ? n : 0;
          return Promise.resolve([]);
        }
      })
      .then((_) => {
        // handle products if any //
        if (linkedProducts.length > 0) {
          return Product.find({ _id: { $in: { linkedProducts } } })
            .populate("images").exec();
        } else {
          return Promise.resolve(null);
        }
      })
      .then((products) => {
        if (products && (products.length > 0)) {
          for (const product of products) {
            if (product.images.length > 0) {
              const absolutePath = (product.images[0] as IProductImage).absolutePath;
              productImgDirectories.push(resolveDirectoryOfImg(absolutePath));
            }
          }
          return Product.deleteMany({ _id: { $in: linkedProducts } });
        } else {
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ ok, n }) => {
        if (ok && n && (n > 0) && (productImgDirectories.length > 0)) {
          numOfProductsDeleted = n;
          return ProductImage.deleteMany({ productId: { $in: linkedProducts } });
        } else {
          numOfProductsDeleted = n ? n : 0;
          return Promise.resolve({ result: { ok: true, n: 0 }, deletedCount: 0 });
        }
      })
      .then(({ ok, n }) => {
        const prodImgRemovePromises: Promise<RemoveResponse>[] = [];

        if (ok && n && (n > 0) && (productImgDirectories.length > 0)) {
          numOfProductImagesDeleted = n;
          // remove service images from their directories //
          for (const imgDirectory of productImgDirectories) {
            prodImgRemovePromises.push(removeDirectoryWithFiles(imgDirectory));
          }
          return Promise.all(prodImgRemovePromises);
        } else {
          numOfProductImagesDeleted = n ? n : 0;
          return Promise.resolve([]);
        } 
      })
      .then((_) => {
        return res.status(200).json({
          responseMsg: "You have sucessfully removed your business account",
          deletedBusinessAccount: deletedAccount,
          deletedBusinessAccountInfo: {
            deletedStores: numOfStoresDeleted,
            deletedStoreImages: numOfStoreImagesDeleted,
            deletedStoreItems: numOfStoreItemsDeleted,
            deletedStoreItemImages: numOfStoreItemImagesDeleted,
            deletedProducts: numOfProductsDeleted,
            deletedProductImages: numOfProductImagesDeleted,
            deletedServices: numOfServicesDeleted,
            deletedServiceImages: numOfServiceImagesDeleted
          }
        });
      })
      .catch((err) => {
        return res.json({
          responseMsg: "An error occured",
          error: err
        })
      })
          
  }
};

export default BusinessAccountsController;