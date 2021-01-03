import { Request, Response } from "express";
import { Types } from "mongoose";
// models and model interfaces //
import { IAdministrator } from "../../models/Administrator";
import Store, { IStore } from "../../models/Store";
import StoreItem, { IStoreItem } from "../../models/StoreItem";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import StoreItemImage, { IStoreItemImage } from "../../models/StoreItemImage";
// additional generic interfaces //
import { IGenericController } from "../_helpers/controllerInterfaces";
import { StoreData } from "./type_declarations/storesControllerTypes";
// helpers and validators //
import { storeDataValidator } from "./helpers/validationHelpers"; 
import { respondWithInputError, resolveDirectoryOfImg, removeDirectoryWithFiles } from "../_helpers/controllerHelpers";
import { RemoveResponse, resolveStoreItemImgDirectories, respondWithNotAllowedErr } from "../_helpers/controllerHelpers"
import { NotAllowedError, NotFoundError, processErrorResponse } from "../_helpers/errorHandlers";
import BusinessAccount from "../../models/BusinessAccount";

interface IGenericStoreResponse {
  responseMsg: string;
  newStore?: IStore;
  editedStore?: IStore;
  deletedStore?: IStore;
  store?: IStore;
  stores?: IStore[];
}

type StoreQueryPar = {
  title?: string;
  items?: string;
  date?: string;
  limit?: string;
}
/**
 * NOTES 
 * By the time any of the 'StoresController' methods are called some of the 
 * following is assumed. <Router> should process some custom middleware
 * including <verifyAdminAndBusinessAccountId> OR <verifyDataModelAccess> OR BOTH!
 * By the time any 'StoresController' methods are called, it is assumed that:
 * 1: <req.user> is defined as 'IAdministrator' model instance
 * 2: <req.user.businessAccountId> is defined for GET_MANY and CREATE methods
 * 3: <req.user.businessAccountId> === <store.businessAcccountID> for GET_ONE, EDIT and DELETE methods
 */

class StoresController implements IGenericController {

  getMany (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
    const { title, items, date, limit } : StoreQueryPar = req.query;
    const { businessAccountId } = req.user as IAdministrator;   
    // query option //
    const queryLimit = limit ? parseInt(limit, 10) : 5;
    // custom queries //

    // sort by title alphabetically //
    if (title) {
      return (
        Store.find({ businessAccountId: businessAccountId })
          .sort({ title: title })
          .limit(queryLimit)
          .populate("images").exec()
      )
      .then((stores) => {
        return res.status(200).json({
          responseMsg: `Loaded ${stores.length} stores and sorted by Store title ${title.toUpperCase()}`,
          stores: stores
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
    }
    // sort by number of items //
    if (items) {
      return (
        Store.find({ businessAccountId: businessAccountId })
          .sort({ numOfItems: items })
          .limit(queryLimit)
          .populate("images").exec()
      )
      .then((stores) => {
        return res.status(200).json({
          responseMsg: `Loaded ${stores.length} stores and sorted by Store Item count ${items.toUpperCase()}`,
          stores: stores
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
    }
    // sort by date created //
    if (date) {
      return (
        Store.find({ businessAccountId: businessAccountId })
          .sort({ createdAt: date })
          .limit(queryLimit)
          .populate("images").exec()
      )
      .then((stores) => {
        return res.status(200).json({
          responseMsg: `Loaded ${stores.length} stores and sorted by date created ${date.toUpperCase()}`,
          stores: stores
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
    }
    // generic response //
    return Store.find({ businessAccountId: businessAccountId })
      .limit(queryLimit)
      .populate("images").exec()
      .then((stores) => {
        return res.status(200).json({
          responseMsg: `Loaded ${stores.length} stores`,
          stores: stores
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
  }

  getOne (req: Request, res: Response<IGenericStoreResponse>): Promise<Response>  {
    const { businessAccountId } = req.user as IAdministrator;
    const { _id : storeId } = req.params;
    // validate user and a business account set up //

    return (
      Store.findOne({ businessAccountId: businessAccountId, _id: storeId })
        .populate("images")
        .exec()
    )
    .then((store) => {
      if (store) {
        return res.status(200).json({
          responseMsg: "Store found",
          store: store
        });
      } else {
        throw new NotFoundError({ messages: [ "Requested Store was not found" ] });
      }
    })
    .catch((error) => {
      return processErrorResponse(res, error);
    });
  }
  
  create (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
    const { businessAccountId } = req.user as IAdministrator;
    const { title, description }: StoreData = req.body;
    let createdStore: IStore;
    // validate correct data input for a new store //
    const { valid, errorMessages} = storeDataValidator(req.body);
    if (!valid) {
      return respondWithInputError(res, "Invalid Input", 422, errorMessages);
    }

    const newStore = new Store({
      businessAccountId: businessAccountId,
      title: title,
      description: description,
      numOfItems: 0,
      images: [],
      createdAt: new Date(Date.now()),
      editedAt: new Date(Date.now())
    });

    return newStore.save()
      .then((store) => {
        createdStore = store;
        const storeId = createdStore._id as Types.ObjectId;
        return BusinessAccount.findOneAndUpdate(
          { _id: businessAccountId },
          { $push: { linkedStores: storeId } }
        );
      })
      .then((_) => {
        return res.status(200).json({
          responseMsg: "New store created",
          newStore: newStore
        });
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }

  edit (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
    const { storeId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;
    const { title, description, images : storeImages = [] }: StoreData = req.body;

    // validate correct data input for store edit //
    const { valid, errorMessages } = storeDataValidator(req.body);
    if (!valid) {
      return respondWithInputError(res, "Invalid Input", 422, errorMessages);
    }

    return (
      Store.findOneAndUpdate(
        { businessAccountId: businessAccountId, _id: storeId },
        { $set: {
            title: title,
            description: description,
            editedAt: new Date(Date.now())
          }  
        },
        { new: true }
      )
      .populate("images")
      .exec()
    )
    .then((updatedStore) => {
      if (updatedStore) {
        return res.status(200).json({
          responseMsg: "Store succesfully updated",
          editedStore: updatedStore
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

  delete (req: Request, res: Response<IGenericStoreResponse>) {
    const { storeId } = req.params; 
    const { businessAccountId } = req.params
    let deletedStore: IStore;
    let storeImagesPath: string;
    let numOfDeletedStoreImages: number = 0; 
    let storeItemsToDelete: boolean = false;
    let numOfDeletedStoreItems: number = 0;
    let numOfDeletedStoreItemImages: number = 0;
    let storeItemIdsWithImages: Types.ObjectId[];
    let storeItemsImgDirectories: string[];
    let storeToDelete: IStore;
    // 

    return (
      Store.findOne({ businessAccountId: businessAccountId, _id: storeId })
      .populate({ path: "images", options: { limit: 1} })
      .exec()
    )
    .then((store) => {
      if (store) {
        return Promise.resolve(store);
      } else {
        throw new NotFoundError({ messages: [ "Store to delete was not found" ] });
      }
    })
    .then((store) => {
      if (store.images.length > 0) {
        storeImagesPath = (store.images[0] as IStoreImage).imagePath;
        return removeDirectoryWithFiles(storeImagesPath);
      } else {
        return Promise.resolve({ success: true, numberRemoved: 0, message: "No Images to remove" });
      }
    }) 
    .then(({ numberRemoved }: RemoveResponse) => {
      // delete StoreImage models from DB //
      if (numberRemoved > 0) {
        return StoreImage.deleteMany({ storeId: storeId }).exec();
      } else {
        return Promise.resolve({ response: { ok: true, n: 0 }, deletedCount: 0 });
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) numOfDeletedStoreImages = deletedCount;
      // find and delete StoreItems if they are present //
      if (storeToDelete.numOfItems > 0) {
        storeItemsToDelete = true;
        return (
          StoreItem
            .find({ businessAccountId: businessAccountId, storeId: storeId })
            .populate({ path: "images", options: { limit: 1} })
            .exec()
        );
      } else {
        return Promise.resolve([]);
      }
    })
    .then((storeItems) => {
      const imgDeletePromises: Promise<RemoveResponse>[] = [];
      if (storeItems.length > 0) {
        // filter store items with images //
        // then get image directories and storeItemId(s) for image delete query //
        storeItemsImgDirectories = storeItems
          .filter((storeItem) => {
            return storeItem.images.length > 0;
          })
          .map((storeItem) => {
            storeItemIdsWithImages.push(storeItem._id as Types.ObjectId);
            return (storeItem.images[0] as IStoreItemImage).imagePath;
          });

        if (storeItemsImgDirectories.length > 0) {
          for (const directory of storeItemsImgDirectories) {
            imgDeletePromises.push(removeDirectoryWithFiles(directory));
          }
          return Promise.all(imgDeletePromises);
        } else {
          return Promise.resolve([]);
        }
      } else {
        return Promise.resolve([]);
      }
    })
    .then((removeResArr) => {
      if (removeResArr.length > 0) {
        return StoreItemImage.deleteMany({ businessAccountId: businessAccountId, storeItemId: { $in: storeItemIdsWithImages } }).exec();
      } else {
        return Promise.resolve({ response: { ok: true, n: 0 }, deletedCount: 0 })
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) numOfDeletedStoreItemImages = deletedCount;
      if (storeItemsToDelete && numOfDeletedStoreItemImages > 0) {
        return StoreItem.deleteMany({ businessAccountId: businessAccountId, storeId: storeId }).exec();
      } else {
        return Promise.resolve({ response: { ok: true, n: 0 }, deletedCount: 0 });
      }
    })
    .then(({ ok, deletedCount }) => {
      if (ok && deletedCount && (deletedCount > 0)) numOfDeletedStoreItems = deletedCount;
      return Store.findOneAndDelete({ businessAccountId: businessAccountId, _id: storeId }).exec();
    })
    .then((deletedStore) => {
      if (deletedStore) {
        const responseMsg = 
          `Deleted Store: ${deletedStore.title}.
           Deleted ${numOfDeletedStoreImages} Store Images.
           Deleted ${numOfDeletedStoreItems} Store Items.
           Deleted ${numOfDeletedStoreItemImages} Store Item Images.
          `
        return res.status(200).json({
          responseMsg: responseMsg,
          deletedStore: deletedStore
        });
      } else {
        throw new NotFoundError({
          messages: [ "Seems like we could not resolve the Store to delete" ]
        });
      }
    })
    .catch((error) => {
      return processErrorResponse(res, error);
    })
  }
}

export default StoresController;