import { Request, Response } from "express";
import { Types } from "mongoose";
import Store, { IStore } from "../models/Store";
import StorePicture, { IStoreImage } from "../models/StoreImage";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";
import ProductImage from "../models/ProductImage";
type StoreImg = {
  _id: string;
  url: string;
}
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
class StoresController implements IGenericController {
  index (req: Request, res: Response<IGenericStoreResponse>): Promise<Response> {
    console.log("called index");
    return Store.find({})
      .populate("images").exec()
      .then((stores) => {
        return res.status(200).json({
          responseMsg: "Loaded all stores",
          stores: stores
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }
  get (req: Request, res: Response<IGenericStoreResponse>): Promise<Response>  {
    console.log("called get")
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
     ).populate("images").exec()
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
   const { _id } = req.params;
   let deletedImages: number;
   if (!_id) {
     return respondWithInputError(res, "Can't find store");
   }
   return Store.findOne({ _id: _id})
    .populate("images")
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
            return StorePicture.deleteMany({ _id: { $in: [ ...storeImgIds ] } })
              .then(({ n }) => {
                n ? deletedImages = n : 0;
                return Store.findOneAndDelete({ _id: _id });
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
              .catch((error) => {
                return respondWithDBError(res, error);
              });
          })
          .catch((err: Error) => {
            return respondWithGeneralError(res, err.message, 400);
          });
      } else {
        return respondWithInputError(res, "Can't find store to delete");
      }
    });
  }
}

export default StoresController;