import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Types } from "mongoose";
import Store, { IStore } from "../models/Store";
import StoreImage, { IStoreImage } from "../models/StoreImage";
import { IGenericController } from "./helpers/controllerInterfaces";
import { RemoveResponse, resolveStoreItemImgDirectories } from "./helpers/controllerHelpers"
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError, resolveDirectoryOfImg, removeDirectoryWithFiles } from "./helpers/controllerHelpers";
import StoreItem from "../models/StoreItem";
import StoreItemImage from "../models/StoreItemImage";

interface IGenericStoreResponse {
  responseMsg: string;
  newStore?: IStore;
  editedStore?: IStore;
  deletedStore?: IStore;
  store?: IStore;
  stores?: IStore[];
}
export type StoreParams = {
  title: string;
  description: string;
  storeImages: IStoreImage[];
}
type StoreQueryPar = {
  title?: string;
  items?: string;
  date?: string;
  limit?: string;
}
class StoresController implements IGenericController {
  index (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
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
        return respondWithDBError(res, error);
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
        return respondWithDBError(res, error);
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
        return respondWithDBError(res, error);
      });
    }
    // generic response //
    return Store.find({})
      .limit(queryLimit)
      .populate("images").exec()
      .then((stores) => {
        return res.status(200).json({
          responseMsg: `Loaded ${stores.length} stores`,
          stores: stores
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }
  get (req: Request, res: Response<IGenericStoreResponse>): Promise<Response>  {
    const _id: string = req.params._id;

    if (!_id) return respondWithInputError(res, "Can't find store");
    return Store.findOne({ _id: _id })
      .populate("images").exec()
      .then((store) => {
        if (store) {
          return res.status(200).json({
            responseMsg: "Store found",
            store: store
          });
        } else {
          return respondWithInputError(res, "Could not find store", 404);
        }
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }
  create (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
    const { title, description, storeImages }: StoreParams = req.body;
    const imgIds: Types.ObjectId[] = [];

    if (storeImages.length > 1) {
      // let imgPromises: [Promise<Query<StoreImg>>];
      for (const newImg of storeImages) {
        imgIds.push(Types.ObjectId(newImg.url));
      }
    }
    const newStore = new Store({
      title: title,
      description: description,
      numOfItems: 0,
      images: [ ...imgIds ]
    });

    return newStore.save()
      .then((newStore) => {
        return res.status(200).json({
          responseMsg: "New store created",
          newStore: newStore
        });
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      });
  }
  edit (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
    const { _id } = req.params;
    const { title, description, storeImages }: StoreParams = req.body;
    const updatesStoreImgs = storeImages.map((img) => Types.ObjectId(img._id));
    if (!_id) {
      return respondWithInputError(res, "Can't resolve store", 400);
    }
    return Store.findOneAndUpdate(
      { _id: _id },
      { 
        $set: {
          title: title,
          description: description,
          images: [ ...updatesStoreImgs ],
          editedAt: new Date()
        },
      },
      { new: true }
     )
      .then((store) => {
        return store?.populate("images")
      })
      .then((store) => {
        return res.status(200).json({
          responseMsg: "Store Updates",
          editedStore: store!
        });
      })
      .catch((error) => {
        console.error(error);
        return respondWithDBError(res, error);
      });
       
  }

  delete (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
   const { _id : storeId } = req.params;
   let numOfDeletedStoreImages: number; 
   let numOfDeletedStoreItems: number;
   let numOfDeletedStoreItemImages: number;
   let storeItemIds: string[];

   if (!storeId) {
     return respondWithInputError(res, "Can't find store");
   }
   else {
    return StoreImage.find({ storeId: storeId })
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
        return StoreImage.deleteMany({ storeId: storeId });
      })
      .then(({ n }) => {
        numOfDeletedStoreImages = n ? n : 0;
        // find and delete StoreItems //
        return StoreItem.find({ storeId: storeId });
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
        console.log(error)
        return respondWithDBError(res, error);
      })
    }
  }
}

export default StoresController;