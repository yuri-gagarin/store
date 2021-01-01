import { Request, Response } from "express";
import { Types } from "mongoose";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../models/Administrator";
import { IGenericController } from "../_helpers/controllerInterfaces"
import BusinessAccount,  { EAccountLevel, IBusinessAccount } from "../../models/BusinessAccount";
import Store from "../../models/Store";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import StoreItem, { IStoreItem } from "../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../models/StoreItemImage";
import Product from "../../models/Product";
import ProductImage, { IProductImage } from "../../models/ProductImage";
import Service from "../../models/Service";
import ServiceImage, { IServiceImage } from "../../models/ServiceImage";
// controller types and interfaces //
import {
  BusinessAccountsContReqParams, BusinessAccountsContRes, 
  BusinessAccountsIndexSortQuery, CreateBusAccountBodyReq, EditAccountBodyReq,
  RemoveStoresAndImgsArgs, RemoveStoreItemsAndImgsArgs,
  RemoveServicesAndImgsArgs, RemoveProductsAndImgsArgs
} from "./type_declarations/businessAccoountsContTypes";
// helpers //
import { removeDirectoryWithFiles, RemoveResponse, resolveDirectoryOfImg, respondWithDBError, respondWithGeneralError, respondWithInputError, rejectWithGenError, respondWithNotAllowedErr } from "../_helpers/controllerHelpers";
import { NotAllowedError, NotFoundError, processErrorResponse, ValidationError } from "../_helpers/errorHandlers";

/**
 * NOTES
 * When 'BusinessAccountsController' methods run, it is assumed that 
 * 1. User is logged in and <passport> middleware has run.
 * 2. For CREATE action, <req.user> object is set and defined.
 * 3. For GET_MANY, GET_ONE, EDIT, DELETE actions, <req.user> is defined and <req.user.businessAccountId> === <req.params.businessAcctId> 
 * 4. OR the logged in <user> has special permissions to edit other accounts/
 */

class BusinessAccountsController implements IGenericController {

  constructor () {
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

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
    const { businessAcctId } = req.params as BusinessAccountsContReqParams;
    if (!businessAcctId) {
      return respondWithInputError(res, "Cant resolve an account to look for", 422);
    }
    return BusinessAccount.findOne({ _id: businessAcctId })
      .populate({ path: "linkedAdmins", model: "Administrator" })
      .populate({ path: "linkedStores", model: "Store", select: "-images" })
      .populate({ path: "linkedServices", model: "Service", select: "-images" })
      .populate({ path: "linkedProducts", model: "Product", select: "-images" })
      .exec()
      .then((businessAccount) => {
        if (businessAccount) {
          return res.status(200).json({
            responseMsg: `Account with id of ${businessAcctId}`,
            businessAccount: businessAccount
          })
        } else {
          return respondWithGeneralError(res, "Could not find an account", 404);
        }
      })
      .catch((err) => {
        console.log(err)
        return processErrorResponse(res, err);
      });
  }

  create(req: Request, res: Response): Promise<Response> {
    const admin = req.user as IAdministrator;
    const { _id: adminId } = admin;
    let newBusinessAccount: IBusinessAccount;

    if (admin.businessAccountId) {
      return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "You already have a BusinessAccount set up" ]);
    }
    return BusinessAccount.create({ 
      linkedAdmins: [ adminId ],
      linkedStores: [],
      linkedServices: [],
      linkedProducts: [],
      accountLevel: EAccountLevel.Standard,
      createdAt: new Date(Date.now()),
      editedAt: new Date(Date.now())
    })
    .then((adminAccount) => {
      return adminAccount
        .populate({ path: 'linkedAdmins', model: "Administrator" })
        .execPopulate();
    })
    .then((createdBusAcccount) => {
      newBusinessAccount = createdBusAcccount;
      return Administrator.findOneAndUpdate(
        { _id: adminId },
        { $set: { businessAccountId: createdBusAcccount._id } },
        { new: true }
      );
    })
    .then((_) => {
      return res.status(200).json({
        responseMsg: "Created a new admin account",
        newBusinessAccount: newBusinessAccount
      });
    })
    .catch((err) => {
      return processErrorResponse(res, err);
    });
  } 

  edit(req: Request<{}, {},EditAccountBodyReq>, res: Response<BusinessAccountsContRes>): Promise<Response> {
    const { businessAcctId } = req.params as BusinessAccountsContReqParams;
    const { linkedBusinesss, linkedStores, linkedServices, accountLevel } = req.body;
    const newAdmins: string[] = req.body.newAdmins || [];
    const adminsToRemove: string[] = req.body.adminsToRemove || [];
    //
    let updatedAccount: IBusinessAccount;
    if (!businessAcctId) {
      return respondWithInputError(res, "Cannot resolve account to edit", 422);
    }

    return (() => {
      if (newAdmins.length > 0) {
        return this.addAdmins(businessAcctId, newAdmins);
      } else {
        return this.removeAdmins(businessAcctId, adminsToRemove);
      }
    })()
    .then((updatedAccount) => {
      return (
        updatedAccount
          .populate({ path: "linkedAdmins", model: "Administrator" })
          .populate({ path: "linkedStores", model: "Store" })
          .populate({ path: "linkedServices", model: "Service" })
          .populate({ path: "linkedProducts", model: "Product" })
          .execPopulate()
       );
    })
    .then((populatedAccount) => {
      return res.status(200).json({
        responseMsg: "Updated Business Account",
        editedBusinessAccount: populatedAccount
      });
    })
    .catch((err) => {
      return processErrorResponse(res, err);
    });
  }

  delete(req: Request, res: Response<BusinessAccountsContRes>) {
    const { businessAcctId } = req.params as BusinessAccountsContReqParams;
    const storeImgDirectories: string[] = [];
    const storeItemImgDirectories: string[] = []
    const serviceImgDirectories: string[] = [];
    const productImgDirectories: string[] = [];
    // 
    let businessAccountToDelete: IBusinessAccount;
    //
    let linkedAdmins: Types.ObjectId[];
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

    if (!businessAcctId) {
      return respondWithInputError(res, "Cannot resolve account to delete", 422);
    }
    return BusinessAccount.findOne({ _id: businessAcctId }).exec()
      .then((businessAccount) => {
        if (businessAccount) {
          businessAccountToDelete = businessAccount;
          linkedAdmins = businessAccount.linkedAdmins as Types.ObjectId[];
          linkedStores = businessAccount.linkedStores as Types.ObjectId[];
          linkedServices = businessAccount.linkedServices as Types.ObjectId[];
          linkedProducts = businessAccount.linkedProducts as Types.ObjectId[];
          return Promise.resolve();
        } else {
          throw new NotFoundError({
            messages: [ "Queried Business Account model to delete was not found" ]
          });
        }
      })
      .then((_) => {
        if (linkedStores.length > 0) {
          return this.removeBusinessAccountStoresAndImages({
            businessAccountId: businessAcctId,
            storeIDs: linkedStores
          }); 
        } else {
          return Promise.resolve({
            deletedStores: 0,
            deletedStoreImages: 0
          });
        }
      })
      .then(({ deletedStores, deletedStoreImages }) => {
        numOfStoresDeleted = deletedStores;
        numOfStoreImagesDeleted = deletedStoreImages;
        if (numOfStoresDeleted > 0) {
          return this.removeBusAccountStoreItemsAndImgs({
            businessAccountId: businessAcctId,
            storeIDs: linkedStores
          });
        } else {
          return Promise.resolve({
            deletedStoreItems: 0,
            deletedStoreItemImgs: 0
          });
        }
      })
      .then(({ deletedStoreItems, deletedStoreItemImgs }) => {
        numOfStoreItemsDeleted = deletedStoreItems;
        numOfStoreItemImagesDeleted = deletedStoreItemImgs;
        if (linkedServices.length > 0) {
          return this.removeBusAccountServicesAndImgs({
            businessAccountId: businessAcctId,
            serviceIDs: linkedServices
          });
        } else {
          return Promise.resolve({
            deletedServices: 0,
            deletedServiceImages: 0
          });
        }
      })
      .then(({ deletedServices, deletedServiceImages }) => {
        numOfServicesDeleted = deletedServices;
        numOfServiceImagesDeleted = deletedServiceImages;
        if (linkedProducts.length > 0) {
          return this.removeBusAccountProductsAndImgs({ 
            businessAccountId: businessAcctId, 
            productIDs: linkedProducts
          });
        } else {
          return Promise.resolve({
            deletedProducts: 0,
            deletedProductImages: 0
          });
        }
      })
      .then(({ deletedProducts, deletedProductImages }) => {
        numOfProductsDeleted = deletedProducts;
        numOfProductImagesDeleted = deletedProductImages;
        return res.status(200).json({
          responseMsg: "You have sucessfully removed your business account",
          deletedBusinessAccount: businessAccountToDelete,
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
      .catch((error) => {
        return processErrorResponse(res, error);
      })
  }

  private addAdmins(businessAccountId: string, adminIDs: string[]): Promise<IBusinessAccount> {
    let updatedAccount: IBusinessAccount; 
    return BusinessAccount.findOneAndUpdate(
      { _id: businessAccountId },
      { 
        $push: { linkedAdmins: { $each: adminIDs } } 
      },
      { new: true }
    )
    .exec()
    .then((updatedAcct) => {
      if (updatedAcct) {
        updatedAccount = updatedAcct;
        return Administrator.updateMany(
            { _id: { $in: adminIDs } }, 
            { $set: { businessAccountId: businessAccountId } },
            { new: true }
        ).exec();
      } else {
        throw new NotFoundError({
          messages: [ "Cannot resolve a 'BusinessAccount' model to update" ]
        });
      }
    })
    .then((_) => {
      return Promise.resolve(updatedAccount);
    })
    .catch((error) => {
      throw error;
    });
  }

  private removeAdmins(businessAccountId: string, adminIDs: string[]): Promise<IBusinessAccount> {
    let updatedAccount: IBusinessAccount;
    // first check if the removal process would remove all admins leaving a //
    // BusinessAcccount model without any admins at all //
    return BusinessAccount.findOne({ _id: businessAccountId }).exec()
      .then((foundAccount) => {
        if (foundAccount) {
          return this.checkIfLastAdmin(foundAccount, adminIDs);
        } else {
          throw new NotFoundError({
            messages: [ "Queried Business Account to edit was not found" ]
          });
        }
      })
      .then((businessAccount) => {
        return BusinessAccount.findOneAndUpdate(
          { _id: businessAccount._id },
          { $pull: { linkedAdmins: { $in: adminIDs } }},
          { new: true }
        )
        .exec()
      })
      .then((updatedAcct) => {
        if (updatedAcct) {
          updatedAccount = updatedAcct;
          return Administrator.updateMany(
            { _id: { $in: adminIDs } },
            { $set: { businessAccountId: null } }
          ).exec();
        } else {
          throw new NotFoundError({
            messages: [ "Cannot resolve a 'BusinessAccount' model to update" ]
          });
        }
      })
      .then((_) => {
        return Promise.resolve(updatedAccount);
      })
      .catch((error) => {
        throw error;
      });
  }

  private checkIfLastAdmin(businessAccount: IBusinessAccount, adminsToRemove: string[]): Promise<IBusinessAccount> {
    if (businessAccount.linkedAdmins.length === 0) {
      throw new NotAllowedError({
        statusCode: 422,
        messages: [ "Seems like there are no Administrators to remove from an account" ]
      })
    } else if (businessAccount.linkedAdmins.length <= adminsToRemove.length) {
      throw new NotAllowedError({
        statusCode: 422,
        messages: [ 
          "Cannot remove all Administrators from the account",
          "There must be at least one Administrator tied to a created account"
        ]
      })
    } else {
      return Promise.resolve(businessAccount);
    }
  }

  private removeBusinessAccountStoresAndImages({ businessAccountId, storeIDs } : RemoveStoresAndImgsArgs) {
    const res = {
      deletedStores: 0,
      deletedStoreImages: 0
    };
    const storeImages: IStoreImage[] = [];

    return (
      Store.find({ businessAccountId: businessAccountId, _id: { $in: storeIDs } })
        .populate({ path: "images", options: { limit: 1 } })
        .exec()
    )
    .then((stores) => {
      if (stores) {
        for (const store of stores) {
          if (store.images.length > 0) {
            storeImages.push(store.images[0] as IStoreImage);
          }
        }
        return Store.deleteMany({ businessAccountId: businessAccountId, _id: { $in: storeIDs } }).exec();
      } else {
        throw new NotFoundError({
          messages: [ "Could not resolve Stores to delete for queried 'BusinessAccount' model" ]
        });
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) res.deletedStores = deletedCount;
      const removePromises: Promise<RemoveResponse>[] = []
      if (storeImages.length > 0) {
        for (const storeImage of storeImages) {
          if (storeImage) {
            removePromises.push(removeDirectoryWithFiles(storeImage.imagePath));
          }
        }
        return Promise.all(removePromises);
      } else {
        return Promise.all(removePromises);
      }
    })
    .then((removeResArr) => {
      if (removeResArr.length > 0) {
        return StoreImage.deleteMany({ businessAccountId: businessAccountId });
      } else {
        return Promise.resolve({ response: { ok: true, n: 0}, deletedCount: 0 })
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) res.deletedStoreImages = deletedCount;
      return res;
    })
    .catch((error) => {
      throw error;
    });
  }
  
  private removeBusAccountStoreItemsAndImgs({ businessAccountId, storeIDs } : RemoveStoreItemsAndImgsArgs) {
    const res = {
      deletedStoreItems: 0,
      deletedStoreItemImgs: 0
    };
    const storeItemImgs : IStoreItemImage[] = [];

    return (
      StoreItem.find({ businessAccountId: businessAccountId, storeId: { $in : storeIDs } })
        .populate({ path: "images", options: { limit: 1 } })
        .exec()
    )
    .then((storeItems) => {
      if (storeItems) {
        for (const storeItem of storeItems) {
          if (storeItem.images.length > 0) {
            storeItemImgs.push(storeItem.images[0] as IStoreItemImage);
          }
        }
        return StoreItem.deleteMany({ businessAccountId: businessAccountId, storeId: { $in: storeIDs } }).exec();
      } else {
        throw new NotFoundError({
          messages: [ "Could not resolve Store Items to delete for queried 'BusinessAccount' model" ]
        });
      }
    })
    .then(({ ok, deletedCount }) => {
      const deletePromises: Promise<RemoveResponse>[] = []
      if (ok && deletedCount && (deletedCount > 0)) res.deletedStoreItems = deletedCount;
      if (storeItemImgs.length > 0) {
        for (const storeItemImg of storeItemImgs) {
          deletePromises.push(removeDirectoryWithFiles(storeItemImg.imagePath));
        }
        return Promise.all(deletePromises);
      } else {
        return Promise.all(deletePromises);
      }
    })
    .then((removeResArr) => {
      if (removeResArr.length > 0) {
        return StoreItemImage.deleteMany({ businessAccountId: businessAccountId }).exec();
      } else {
        return Promise.resolve({ response: { ok: true, n: 0 }, deletedCount: 0 });
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) res.deletedStoreItemImgs = deletedCount;
      return res;
    })
    .catch((error) => {
      throw error;
    });
  }

  private removeBusAccountServicesAndImgs({ businessAccountId, serviceIDs } : RemoveServicesAndImgsArgs) {
    const res = {
      deletedServices: 0,
      deletedServiceImages: 0
    };
    const serviceImages: IServiceImage[] = [];

    return (
      Service.find({ businessAccountId: businessAccountId, _id: { $in: serviceIDs } })
        .populate({ path: "images", options: { limit: 1 } })
        .exec()
    )
    .then((services) => {
      if (services) {
        for (const service of services) {
          if (service.images.length > 0) {
            serviceImages.push(service.images[0] as IServiceImage);
          }
        }
        return Service.deleteMany({ businessAccountId: businessAccountId, _id: { $in: serviceIDs } }).exec();
      } else {
        throw new NotFoundError({
          messages: [ "Could not resolve Services to delete for queried 'BusinessAccount' model" ]
        });
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) res.deletedServices = deletedCount;
      const removePromises: Promise<RemoveResponse>[] = []
      if (serviceImages.length > 0) {
        for (const serviceImage of serviceImages) {
          removePromises.push(removeDirectoryWithFiles(serviceImage.imagePath));
        }
        return Promise.all(removePromises);
      } else {
        return Promise.all(removePromises);
      }
    })
    .then((removeResArr) => {
      if (removeResArr.length > 0) {
        return ServiceImage.deleteMany({ businessAccountId: businessAccountId, serviceId: { $in: serviceIDs } });
      } else {
        return Promise.resolve({ response: { ok: true, n: 0}, deletedCount: 0 })
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) res.deletedServiceImages = deletedCount;
      return res;
    })
    .catch((error) => {
      throw error;
    });
  }

  private removeBusAccountProductsAndImgs({ businessAccountId, productIDs } : RemoveProductsAndImgsArgs) {
    const res = {
      deletedProducts: 0,
      deletedProductImages: 0
    };
    const productImages: IProductImage[] = [];

    return (
      Product.find({ businessAccountId: businessAccountId, _id: { $in: productIDs } })
        .populate({ path: "images", options: { limit: 1 } })
        .exec()
    )
    .then((products) => {
      if (products) {
        for (const product of products) {
          if (product.images.length > 0) {
            productImages.push(product.images[0] as IProductImage);
          }
        }
        return Product.deleteMany({ businessAccountId: businessAccountId, _id: { $in: productIDs } }).exec();
      } else {
        throw new NotFoundError({
          messages: [ "Could not resolve Products to delete for queried 'BusinessAccount' model" ]
        });
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) res.deletedProducts = deletedCount;
      const removePromises: Promise<RemoveResponse>[] = []
      if (productImages.length > 0) {
        for (const productImage of productImages) {
          removePromises.push(removeDirectoryWithFiles(productImage.imagePath));
        }
        return Promise.all(removePromises);
      } else {
        return Promise.all(removePromises);
      }
    })
    .then((removeResArr) => {
      if (removeResArr.length > 0) {
        return ProductImage.deleteMany({ businessAccountId: businessAccountId, productId: { $in: productIDs } });
      } else {
        return Promise.resolve({ response: { ok: true, n: 0}, deletedCount: 0 })
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) res.deletedProductImages = deletedCount;
      return res;
    })
    .catch((error) => {
      throw error;
    });
  }

};

export default BusinessAccountsController;