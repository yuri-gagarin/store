import { Request, Response } from "express";
import { Types } from "mongoose";
import StoreItem, { IStoreItem } from "../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../models/StoreItemImage";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";

interface IGenericProdRes {
  responseMsg: string;
  newStoreItem?: IStoreItem;
  editedStoreItem?: IStoreItem;
  deletedStoreItem?: IStoreItem;
  storeItem?: IStoreItem;
  storeItems?: IStoreItem[];
}
export type StoreItemParams = {
  storeId: string;
  name: string;
  description: string;
  details: string;
  price: string;
  categories: string[];
  storeItemImages: IStoreItemImage[];
}

class StoreItemsController implements IGenericController {

  index (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    return StoreItem.find({})
      .populate("images").exec()
      .then((storeItems) => {
        return res.status(200).json({
          responseMsg: "Loaded all Store Items",
          storeItems: storeItems
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }

  get (req: Request, res: Response<IGenericProdRes>): Promise<Response>  {
    const _id: string = req.params._id;
  
    if (!_id) return respondWithInputError(res, "Can't find Store Item");

    return StoreItem.findOne({ _id: _id })
      .populate("images").exec()
      .then((storeItem) => {
        if (storeItem) {
          return res.status(200).json({
            responseMsg: "Returned Store Item",
            storeItem: storeItem
          });
        } else {
          return respondWithInputError(res, "Could not find Store Item", 404);
        }
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }

  create (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { name, description, details, price, storeItemImages }: StoreItemParams = req.body;
    const imgIds: Types.ObjectId[] = [];

    if (Array.isArray(storeItemImages) && (storeItemImages.length > 1)) {
      for (const newImg of storeItemImages) {
        imgIds.push(Types.ObjectId(newImg.url));
      }
    }

    const newStoreItem = new StoreItem({
      name: name,
      description: description,
      details: details,
      price: price,
      images: [ ...imgIds ]
    });

    return newStoreItem.save()
      .then((newStoreItem) => {
        return res.status(200).json({
          responseMsg: "New StoreItem created",
          newStoreItem: newStoreItem
        });
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      });
  }

  edit (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
    const { _id } = req.params;
    const { name, description, details, price, storeItemImages }: StoreItemParams = req.body;
    const updatedStoreItemImgs: Types.ObjectId[] = [];

    if (!_id) {
      return respondWithInputError(res, "Can't resolve Store Item", 400);
    }
    if (Array.isArray(storeItemImages) && (storeItemImages.length > 0)) {
      for (const img of storeItemImages) {
        updatedStoreItemImgs.push(img._id);
      }
    }

    return StoreItem.findOneAndUpdate(
      { _id: _id },
      { 
        $set: {
          name: name,
          description: description,
          details: details,
          price: price,
          images: [ ...updatedStoreItemImgs ],
          editedAt: new Date()
        },
      },
      { new: true }
     ).populate("images").exec()
      .then((editedStoreItem) => {
        return res.status(200).json({
          responseMsg: "Store Item updated",
          editedStoreItem: editedStoreItem!
        });
      })
      .catch((error) => {
        console.error(error);
        return respondWithDBError(res, error);
      });
       
  }

  delete (req: Request, res: Response<IGenericProdRes>): Promise<Response> {
   const { _id } = req.params;

   let deletedImages: number;
   const storeItemImagePaths: string[] = [];
   const storeItemImageIds: string[] = [];
   const deletePromises: Promise<boolean>[] = [];

   if (!_id) {
     return respondWithInputError(res, "Can't resolve Store Item");
   }

   return StoreItem.findOne({ _id: _id})
    .populate("images")
    .then((storeItem) => {
      // first delete all StoreItem images //
      if (storeItem) {
        for (const image of storeItem.images) {
          const img = image as IStoreItemImage;
          storeItemImagePaths.push(img.absolutePath);
          storeItemImageIds.push(img._id);
        }
        for (const path of storeItemImagePaths) {
          deletePromises.push(deleteFile(path));
        }
        return Promise.all(deletePromises)
          .then(() => {
            return StoreItemImage.deleteMany({ _id: { $in: [ ...storeItemImageIds ] } })
              .then(({ n }) => {
                n ? deletedImages = n : 0;
                return StoreItem.findOneAndDelete({ _id: _id });
              })
              .then((storeItem) => {
                if (storeItem) {
                  return res.status(200).json({
                    responseMsg: "Deleted the Store Item and " + deletedImages,
                    deletedStoreItem: storeItem
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
        return respondWithInputError(res, "Can't find Store Item to delete");
      }
    });
  }

}

export default StoreItemsController;