import { Request, Response } from "express";
import { Types, model } from "mongoose";
import Store from "../models/Store";
import StorePicture, {IStorePicture} from "../models/StorePicture";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";
type StoreImg = {
  _id: string;
  url: string;
}
type PopulatedImage = {
  _id: Types.ObjectId;
  absolutePath: string;
}
type StoreParams = {
  title?: string;
  description: string;
  storeImages: [StoreImg];
}
class StoreController implements IGenericController {
  constructor () {
  }

  get (req: Request, res: Response): Promise<Response>  {
    const _id: string | undefined = req.params._id;
    if (!_id) return respondWithInputError(res, "Can't find store");
    return Store.findOne({ _id: _id })
      .populate("images", [ "_id"])
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
  create (req: Request, res: Response): Promise<Response> {
    const { title, description, storeImages }: StoreParams = req.body;
    let imgIds: Types.ObjectId[] = [];

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
  edit (req: Request, res: Response): Promise<Response> {
    const { _id } = req.params;
    const { title, description, storeImages }: StoreParams = req.body;
    const updatesStoreImgs = storeImages.map((img) => Types.ObjectId(img._id))
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
    ).then((updatedStore) => {
        return Store.populate(updatedStore, { path: "images", model: "StorePicture" })
      })
      .then((store) => {
        return res.status(200).json({
          reponseMsg: "Store Updates",
          updatedStore: store
        });
      })
      .catch((error) => {
        console.error(error);
        return respondWithDBError(res, error);
      })
       
  }

  delete (req: Request, res: Response): Promise<Response> {
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
          return (<IStorePicture>image).absolutePath
        })
        const storeImgIds: Types.ObjectId[] = store.images.map((image) => {
          return (<IStorePicture>image)._id;
        })
        const deletePromises: Promise<boolean>[] = [];
        for (const path of storeImgPaths) {
          deletePromises.push(deleteFile(path));
        }
        return Promise.all(deletePromises)
          .then((response) => {
            return StorePicture.deleteMany({ _id: { $in: [ ...storeImgIds ] } })
              .then(({ n }) => {
                n ? deletedImages = n : 0;
                return Store.deleteOne({ _id: _id });
              })
              .then((response) => {
                return res.status(200).json({
                  responseMsg: "Deleted the store and " + deletedImages,
                  response: response
                });
              })
              .catch((error) => {
                return respondWithDBError(res, error);
              });
          })
          .catch((err) => {
            return respondWithGeneralError(res, "Coudln't complete the operation", 400);
          });
      } else {
        return respondWithInputError(res, "Can't find store to delete");
      }
    });
  }
}

export default StoreController;