import { Request, Response } from "express";
import { Types } from "mongoose";
// models and model interfaces //
import { IAdministrator } from "../../models/Administrator";
import Store, { IStore } from "../../models/Store";
import StoreItem from "../../models/StoreItem";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
import StoreItemImage from "../../models/StoreItemImage";
// additional generic interfaces //
import { IGenericController } from "../_helpers/controllerInterfaces";
import { StoreData } from "./type_declarations/storesControllerTypes";
// helpers and validators //
import { storeDataValidator } from "./helpers/validationHelpers"; 
import { respondWithInputError, resolveDirectoryOfImg, removeDirectoryWithFiles } from "../_helpers/controllerHelpers";
import { RemoveResponse, resolveStoreItemImgDirectories, respondWithNotAllowedErr } from "../_helpers/controllerHelpers"
import { NotAllowedError, NotFoundError, processErrorResponse } from "../_helpers/errorHandlers";

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
class StoresController implements IGenericController {
  getMany (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
    const admin: IAdministrator = req.user as IAdministrator;
    // validate user and a business account set up //
    if (admin) {
      if (!admin.businessAccountId) {
        return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "Create a Business Acccount or request to be added to one to get all features"]);
      }
    } else {
      return respondWithNotAllowedErr(res);
    }
    // query option //
    const { title, items, date, limit } : StoreQueryPar = req.query;
    const queryLimit = limit ? parseInt(limit, 10) : 5;
    // custom queries //
    // sort by title alphabetically //
    if (title) {
      return (
        Store.find({})
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
        Store.find({})
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
        Store.find({})
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
    return Store.find({ businessAccountId: admin.adminAccountId })
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
    const admin: IAdministrator = req.user as IAdministrator;
    const { _id : storeId } = req.params;
    // validate user and a business account set up //
    if (admin) {
      if (!admin.businessAccountId) {
        return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "Create a Business Acccount or request to be added to one to get all features"]);
      }
    } else {
      return respondWithNotAllowedErr(res);
    }
    // ensure a Store id was send //
    if (!storeId) return respondWithInputError(res, "Can't find store");

    return Store.findOne({ _id: storeId })
      .then((store) => {
        if (store) {
          if ((store.businessAccountId as Types.ObjectId).equals(admin.businessAccountId!)) {
            return store.populate("images").execPopulate();
          } else {
            throw new NotAllowedError({ messages: [ "Not allowed to view Stores belonging to another account" ] });
          }
        } else {
          throw new NotFoundError({ messages: [ "Requested Store was not found" ] });
        }
      })
      .then((store) => {
        return res.status(200).json({
          responseMsg: "Store found",
          store: store
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
  }
  create (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
    let businessAccountId: Types.ObjectId;
    // first ensure admin and businessAccountId exist //
    const admin: IAdministrator = req.user as IAdministrator;
    if (admin) {
      if (!admin.businessAccountId) {
        return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "Create a Business Acccount or be added to one to create Stores" ]);
      } else {
        businessAccountId = admin.businessAccountId;
      }
    } else {
      return respondWithNotAllowedErr(res);
    }
    // store create arguments //
    const { title, description }: StoreData = req.body;
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
      .then((newStore) => {
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
    const { _id : storeId } = req.params;
    let businessAccountId: Types.ObjectId;
    // first ensure admin and businessAccountId exist //
    const admin: IAdministrator = req.user as IAdministrator;
    // validate user and a business account set up //
    if (admin) {
      if (!admin.businessAccountId) {
        return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "Create a Business Acccount or be added to one to edit Stores" ]);
      } else {
        businessAccountId = admin.businessAccountId;
      }
    } else {
      return respondWithNotAllowedErr(res);
    }
    // ensure Store _id was sent //
    if (!storeId) {
      return respondWithInputError(res, "Can't resolve store", 400);
    }
    // Store update data //
    const { title, description, images : storeImages = [] }: StoreData = req.body;
    // validate correct data input for store edit //
    const { valid, errorMessages } = storeDataValidator(req.body);
    if (!valid) {
      return respondWithInputError(res, "Invalid Input", 422, errorMessages);
    }

    return Store.findOne({ _id: storeId }).exec()
      .then((store) => {
        if (!store) {
          throw new NotFoundError({ messages: [ "Store to update not found" ] });
        } else {
          if ((store.businessAccountId as Types.ObjectId).equals(businessAccountId)) {
            return Promise.resolve(store);
          } else {
            throw new NotAllowedError({ messages: [ "NOt allowed to edit a Store which does not belong to your account"] });
          }
        }
      })
      .then((store) => {
        store.title = title;
        store.description = description;
        store.images = storeImages as Types.ObjectId[];
        store.editedAt = new Date(Date.now());
        return store.save();
      })
      .then((store) => {
        return Store.populate(store, { path: "images" });
      })
      .then((store) => {
        return res.status(200).json({
          responseMsg: "Store Updates",
          editedStore: store as IStore
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
       
  }

  delete (req: Request, res: Response<IGenericStoreResponse>) {
    let numOfDeletedStoreImages: number; 
    let numOfDeletedStoreItems: number;
    let numOfDeletedStoreItemImages: number;
    let storeItemIds: string[];
    let businessAccountId: Types.ObjectId | string;
    let storeToDelete: IStore;
    // 
    const { _id : storeId } = req.params;
    const admin: IAdministrator = req.user as IAdministrator;
    // validate user and a business account set up //
    if (admin) {
      if (!admin.businessAccountId) {
        return respondWithNotAllowedErr(res, "Action not allowed", 401, [ "Create a Business Acccount or be added to one to delete and manage Stores" ]);
      } else {
        businessAccountId = admin.businessAccountId;
      }
    } else {
      return respondWithNotAllowedErr(res);
    }
    // ensure Store model id was sent //
    if (!storeId) {
      return respondWithInputError(res, "Can't resolve Store");
    }

    return Store.findOne({ _id: storeId }).exec()
      .then((store) => {
        if (store) {
          if ((store.businessAccountId as Types.ObjectId).equals(businessAccountId)) {
            return store.populate("images").execPopulate();
          } else {
            throw new NotAllowedError({ messages: [ "Not allowed to delete Store which doesn't belong to your account" ] });
          }
        } else {
          throw new NotFoundError({ messages: [ "Store to delete was not found" ] });
        }
      })
      .then((store) => {
        storeToDelete = store;
        if (store.images.length > 0) {
          return StoreImage.find({ storeId: storeId });
        } else {
          return Promise.resolve([]);
        }
      })
      .then((storeImages) => {
        if (storeImages.length > 0) {
          const imagesDirectory = resolveDirectoryOfImg(storeImages[0].absolutePath)
          return removeDirectoryWithFiles(imagesDirectory);
        } else {
          return Promise.resolve({ success: true, numberRemoved: 0, message: "No Images to remove" });
        }
      }) 
      .then(({ success, numberRemoved, message }: RemoveResponse) => {
        // delete StoreImage models from DB //
        if (numberRemoved > 0) {
          return StoreImage.deleteMany({ storeId: storeId });
        } else {
          return Promise.resolve({ n: 0 });
        }
      })
      .then(({ n }) => {
        numOfDeletedStoreImages = n ? n : 0;
        // find and delete StoreItems if they are present //
        if (storeToDelete.numOfItems > 0) {
          return StoreItem.find({ storeId: storeId })
        } else {
          return Promise.resolve([]);
        }
      })
      .then((storeItems) => {
        if (storeItems.length > 0) {
          storeItemIds = storeItems.map((storeItem) => storeItem._id);
          return StoreItem.deleteMany({ storeId: storeId });
        } else {
          return Promise.resolve({ n: 0 })
        }
      })
      .then(({ n }) => {
        numOfDeletedStoreItems = n ? n : 0;
        // deal with potential store item images //
        return StoreItemImage.find({ storeItemId: { $in: storeItemIds } });
      })
      .then((storeItemImages) => {
        if (storeItemImages.length > 0) {
          // proceed with removing images and data //
          // resolve directories first //
          const directoriesToDelete: string[] = resolveStoreItemImgDirectories(storeItemImages);
          const removeResponses: Promise<RemoveResponse>[] = []; 
          for (const directory of directoriesToDelete) {
            removeResponses.push(removeDirectoryWithFiles(directory));
          }
          return Promise.all(removeResponses);
        } else {
          Promise.resolve<[RemoveResponse]>([{ success: true, numberRemoved: 0, message: "No Store Item Images to remove" }]);
        }
      })  
      .then((response) => {
        if (response && response.length > 0) {
          const totalStoreItemImgsDeleted: RemoveResponse = response.reduce((prev, next) => { 
            return {
              numberRemoved: prev.numberRemoved + next.numberRemoved,
              success: true,
              message: `Total removed`
            }
          });
          return StoreItemImage.deleteMany({ storeItemId: { $in: storeItemIds }})
        } else {
          return Promise.resolve({ n: 0 });
        }
      })
      .then(({ n }) => {
        return Store.findOneAndDelete({ _id: storeId })
      })
      .then((deletedStore) => {
        return res.status(200).json({
          responseMsg: `Removed Store`,
          deletedStore: deletedStore!
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      })
    }
    
  
}

export default StoresController;