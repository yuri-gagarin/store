import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Types } from "mongoose";
import Store, { IStore } from "../models/Store";
import StoreImage, { IStoreImage } from "../models/StoreImage";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";
import StoreItem from "../models/StoreItem";

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
   let deletedImages: number; let deletedStoreItems: number;
   if (!storeId) {
     return respondWithInputError(res, "Can't find store");
   }
   return Store.findOne({ _id: storeId})
    .populate("images").exec()
    .then((store) => {
      // first delete all store images //
      if (store) {
        const storeImgPaths = store.images.map((image) => {
          return (image as IStoreImage).absolutePath;
        });
        const storeImgIds: Types.ObjectId[] = store.images.map((image) => {
          return (image as IStoreImage)._id;
        });
        const deletePromises: Promise<boolean>[] = [];
        for (const path of storeImgPaths) {
          deletePromises.push(deleteFile(path));
        }
        return Promise.all(deletePromises)
          .then(() => {
            // remove empty directory //
            const directory = path.join(path.resolve("public", "uploads", "store_images", storeId));
            return fs.promises.rmdir(directory);
          })
          .then(() => {
            return StoreItem.deleteMany({ storeId: storeId })
          })
          .then(({ n }) => {
            n ? deletedStoreItems = n : 0;
            return StoreImage.deleteMany({ storeId: storeId })
          })
          .then(({ n }) => {
            n ? deletedImages = n : 0;
            return Store.findOneAndDelete({ _id: storeId });
          })
          .then((store) => {
            if (store) {
              return res.status(200).json({
                responseMsg: "Deleted the store and " + deletedImages,
                deletedStore: store
              });
            }
            else {
              return respondWithDBError(res, new Error("Can't resolve delete"));
            }
          })
          .catch((err: Error) => {
            console.log(err)
            return respondWithGeneralError(res, err.message, 400);
          });
      } else {
        return respondWithInputError(res, "Can't find store to delete");
      }
    });
  }
}

export default StoresController;