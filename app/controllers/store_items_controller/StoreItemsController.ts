import { Request, Response } from "express";
import { Types } from "mongoose";
// models and model interfaces //
import Store, { IStore } from "../../models/Store";
import StoreItem, { IStoreItem } from "../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../models/StoreItemImage";
// additional types and interfaces //
import { IGenericController } from "../_helpers/controllerInterfaces";
import { IGenericStoreImgRes, StoreItemData, StoreItemQueryPar } from "./type_declarations/storeItemsControllerTypes";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError, removeDirectoryWithFiles } from "../_helpers/controllerHelpers";
import { validateStoreItems } from "./helpers/validationHelpers";
import { IAdministrator } from "../../models/Administrator";
import { NotFoundError, processErrorResponse } from "../_helpers/errorHandlers";
import { promises } from "dns";

/**
 * NOTES 
 * 
 * By the time any methods in 'StoreItemsController' are called, the request will have gone through either
 * <passport> middleware, <verifyAdminAndBusinessAccountId> middleware, <verifyStoreItemModelAccess> middleware or
 * through all of them.
 * 
 * For <getMany> method the following is assumed:
 * 1: Admin is logged in and <req.user> object exists.
 * 2: Admin has a BusinessAccount set up, <req.user.businessAccountId> is defined.
 * 
 * For <getOne>, <create>, <edit>, <delete> actions the following is assumed:
 * 1: Admin is logged in and <req.user< object exists.
 * 2: Admin has a BusinessAccount set up, <req.user.businessAccountId> is defined.
 * 3: Admin's <req.user.businessAccountId> === <store.businessAcccountId> and <req.user.businessAccountId> === <storeItem.businessAccountId> when needed.
 *
 */

class StoreItemsController implements IGenericController {

  getMany (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response> {
    const { businessAccountId } = req.user as IAdministrator;
    const { storeName, storeId, limit, date, price, name }  = req.query as StoreItemQueryPar;
    let foundStore: IStore; let storeItems: IStoreItem[];
    // return store items by store name //
    if (storeName && !price && !date) {
      return Store.find({ title: storeName })
        .then((stores) => {
          foundStore = stores[0];
          return (
            StoreItem.find({ storeId: foundStore._id })
              .limit(limit ? parseInt(limit, 10) : 10)
              .populate("images").exec()
          );
        })
        .then((storeItems) => {
          return res.status(200).json({
            responseMsg: `Loaded all Store Item from Store: ${foundStore.title}`,
            storeItems: storeItems
          });
        })
        .catch((error) => {
          return respondWithDBError(res, error);
        });
    }
    // return store items by date //
    if (date) {
      if (storeName) {
        // return store items from a specific store by date //
        return Store.find({ title: storeName })
          .then((stores) => {
            foundStore = stores[0];
            return (
              StoreItem.find({ storeId: foundStore._id})
                .sort({ createdAt: date })
                .limit(limit ? parseInt(limit, 10) : 10)
                .populate("images").exec()
            );
          })
          .then((storeItems) => {
            return res.status(200).json({
              responseMsg: `Loaded all Store Items from Store ${foundStore.title}`,
              storeItems: storeItems
            });
          })
          .catch((error) => {
            return respondWithDBError(res, error);
          });
      } else {
        return ( 
          StoreItem.find({})
            .sort({ createdAt: date })
            .limit(limit ? parseInt(limit, 10) : 10)
            .populate("images").exec()
          )
          .then((storeItems) => {
            return res.status(200).json({
              responseMsg: `Loaded all Store Items by date in order: ${date}`,
              storeItems: storeItems
            });
          })
          .catch((error) => {
            return respondWithDBError(res, error);
          })
      }  
    }
    // return store items by price //
    if (price) {
      if (storeName) {
        // return store items form a specific store by price //
        return Store.find(({ title: storeName }))
          .then((stores) => {
            foundStore = stores[0];
            return (
              StoreItem.find({ storeId: foundStore._id })
                .sort({ price: price })
                .limit(limit ? parseInt(limit, 10) : 10)
                .populate("images").exec()
            );
          })
          .then((storeItems) => {
            return res.status(200).json({
              responseMsg: `Loaded Store Items from store ${storeName} and sorted by price ${price}`,
              storeItems: storeItems
            });
          })
          .catch((error) => {
            return respondWithDBError(res, error);
          })
      }
      else {
        return (
          StoreItem.find({})
            .sort({ price: price })
            .limit(limit ? parseInt(limit, 10) : 10)
            .populate("images").exec()
        )
        .then((storeItems) => {
          return res.status(200).json({
            responseMsg: `Loaded Store Items and sorted by price ${price}`,
            storeItems: storeItems
          });
        })
        .catch((error) => {
          return respondWithDBError(res, error);
        });
      }
    }
    // a query with no specific params only possible limit //
    return (
      StoreItem.find({ businessAccountId: businessAccountId })
        .limit(limit ? parseInt(limit, 10) : 10)
        .populate("images").exec()
        .then((foundStoreItems) => {
          storeItems = foundStoreItems;
          return StoreItem.countDocuments().exec();
        })
        .then((value) => {
          return res.status(200).json({
            responseMsg: "Loaded all Store Items",
            numberOfItems: value,
            storeItems: storeItems
          });
        })
        .catch((error) => {
          return respondWithDBError(res, error);
        })
    );
  }

  getOne (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response>  {
    const { businessAccountId } = req.user as IAdministrator;
    const { storeItemId } = req.params;

    return (
      StoreItem.findOne({ businessAccountId: businessAccountId, _id: storeItemId })
      .populate("images").exec()
    )
    .then((storeItem) => {
      if (storeItem) {
        return res.status(200).json({
          responseMsg: "Returned Store Item",
          storeItem: storeItem
        });
      } else {
        throw new NotFoundError({
          messages: [ "Could not find the queried Store Item" ]
        })
      }
    })
    .catch((error) => {
      return processErrorResponse(res, error);
    });
  }

  create (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response> {
    const { businessAccountId } = req.user as IAdministrator;
    const { storeId } = req.params;
    
    // immediate data validation //
    const { valid, errorMessages } = validateStoreItems(req.body);
    if (!valid) {
      return respondWithInputError(res, "Validation Error", 422, errorMessages);
    }

    const { storeName, name, description, details, price, categories = [] }: StoreItemData = req.body;

    const newStoreItem = new StoreItem({
      businessAccountId: businessAccountId,
      storeId: storeId,
      storeName: storeName,
      name: name,
      description: description,
      details: details,
      price: price as number,
      images: [],
      categories: categories,
      createdAt: new Date(Date.now()),
      editedAt: new Date(Date.now())
    });
    return (
      Store.findByIdAndUpdate(
        { businessAccountId: businessAccountId, _id: storeId }, 
        { $inc : { numOfItems: 1 } }
      )
    )
    .then((store) => {
      if (store) {
        return newStoreItem.save();
      } else {
        throw new NotFoundError({
          messages: [ "Could not resolve the Store to tie Store Item to" ]
        });
      }
    })
    .then((newStoreItem) => {
      return res.status(200).json({
        responseMsg: "New StoreItem created",
        newStoreItem: newStoreItem
      });
    })
    .catch((err) => {
      return processErrorResponse(res, err);
    });
  }

  edit (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response> {
    const { businessAccountId } = req.user as IAdministrator;
    const { storeId, storeItemId } = req.params;
    const { name, description, details, price, images : storeItemImages = [], categories = [] }: StoreItemData = req.body;
    const updatedStoreItemImgs: Types.ObjectId[] = [];
    
    // validate correct input first //
    const { valid, errorMessages } = validateStoreItems(req.body);
    if (!valid) {
      return respondWithInputError(res, "Validation Error", 422, errorMessages);
    }

    if (Array.isArray(storeItemImages) && (storeItemImages.length > 0)) {
      for (const imgId  of storeItemImages) {
        updatedStoreItemImgs.push(Types.ObjectId(imgId));
      }
    }

    return (
      StoreItem.findOneAndUpdate(
      { businessAccountId: businessAccountId, storeId: storeId, _id: storeItemId },
      { 
        $set: {
          name: name,
          description: description,
          details: details,
          price: price as number,
          images: updatedStoreItemImgs,
          categories: categories,
          editedAt: new Date(Date.now())
        },
      },
      { new: true }
     )
     .populate("images").exec()
    )
    .then((editedStoreItem) => {
      if (editedStoreItem) {
        return res.status(200).json({
          responseMsg: "Store Item updated",
          editedStoreItem: editedStoreItem!
        });
      } else {
        throw new NotFoundError({
          messages: [ "Could not resolve queried Store Item to update" ]
        });
      }
    })
    .catch((error) => {
      return processErrorResponse(res, error);
    });
       
  }

  delete (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response> {
    const { storeId, storeItemId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;

   let deletedImages: number; let deletedItem: IStoreItem;
   const storeItemImageIds: string[] = [];

   

   return (
    StoreItem.findOne({ businessAccountId: businessAccountId, storeId: storeId, _id: storeItemId })
    .populate({ path: "images", options: { limit: 1 } })
    .exec()
  )
  .then((storeItem) => {
      // first delete all StoreItem images if there are any //
    if (storeItem) {
      if (storeItem.images[0]) {
        const imageDirectory = (storeItem.images[0] as IStoreItemImage).imagePath;
        return removeDirectoryWithFiles(imageDirectory);
      } else {
        return Promise.resolve({ success: true, numberRemoved: 0, message: "No images to remoce" });
      }
    } else {
      throw new NotFoundError({
        messages: [ "Queried Store Item to delete was not found" ]
      });
    }
  })
    .then(({ numberRemoved }) => {
      if (numberRemoved && (numberRemoved > 0)) {
        return StoreItemImage.deleteMany({ _id: { $in: [ ...storeItemImageIds ] } });
      } else {
        return Promise.resolve({ response : { n: 0, ok: true }, deletedCount: 0 });
      }
    })
    .then(({ n }) => {
      (n && n > 0) ? deletedImages = n : 0;
      return StoreItem.findOneAndDelete({ businessAccountId: businessAccountId, storeId: storeId, _id: storeItemId });
    })
    .then((storeItem) => {
      if (storeItem) {
        deletedItem = storeItem;
        return Store.findOneAndUpdate(
          { businessAccountId: businessAccountId, _id: storeId }, 
          { $inc: { numOfItems: -1 } },
          { new: true }
        ).exec();
      } else {
        throw new NotFoundError({
          messages: [ "Could not resolve a Store Item to delete" ]
        });
      }
    })
    .then((store) => {
      if (store) {
        return res.status(200).json({
          responseMsg: "Deleted the Store Item and " + deletedImages,
          deletedStoreItem: deletedItem
        });
      } else {
        throw new NotFoundError({
          messages: [ "Could not resolve the Store model to update" ]
        });
      }
    })
    .catch((error) => {
      return processErrorResponse(res, error);
    });            
  }

}

export default StoreItemsController;