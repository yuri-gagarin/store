import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import Store, { IStore } from "../models/Store";
import StoreItem, { IStoreItem } from "../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../models/StoreItemImage";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";
import { validateStoreItems } from "./validators/formValidators";

interface IGenericStoreImgRes {
  responseMsg: string;
  numberOfItems?: number;
  newStoreItem?: IStoreItem;
  editedStoreItem?: IStoreItem;
  deletedStoreItem?: IStoreItem;
  storeItem?: IStoreItem;
  storeItems?: IStoreItem[];
}
export type StoreItemParams = {
  storeId?: string;
  storeName?: string;
  name?: string;
  description?: string;
  details?: string;
  price?: string | number;
  categories?: string[];
  images?: IStoreItemImage[];
}
type StoreItemQueryPar = {
  storeName?: string;
  storeId?: string;
  limit?: string;
  date?: string;
  price?: string;
  name?: string;
}

class StoreItemsController implements IGenericController {

  index (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response> {
    let foundStore: IStore; let storeItems: IStoreItem[];
    const { storeName, storeId, limit, date, price, name }  = req.query as StoreItemQueryPar;
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
      StoreItem.find({})
        .limit(limit ? parseInt(limit, 10) : 10)
        .populate("images").exec()
        .then((foundStoreItems) => {
          storeItems = foundStoreItems;
          return StoreItem.countDocuments();
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

  get (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response>  {
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

  create (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response> {
    // immediate data validation //
    const { isValid, errors } = validateStoreItems(req.body);
    if (!isValid) {
      return respondWithInputError(res, "Validation Error", 422, errors);
    }

    const { name, description, details, price, images : storeItemImages, categories }: StoreItemParams = req.body;
    const storeId = req.body.storeId as unknown as Types.ObjectId;
    const storeName: string = req.body.storeName;
    const imgIds: Types.ObjectId[] = [];
    
    if (Array.isArray(storeItemImages) && (storeItemImages.length > 1)) {
      for (const newImg of storeItemImages) {
        imgIds.push(Types.ObjectId(newImg.url));
      }
    }

    const newStoreItem = new StoreItem({
      storeId: storeId,
      storeName: storeName,
      name: name,
      description: description,
      details: details,
      price: price as number,
      images: [ ...imgIds ],
      categories: categories
    });
    return Store.findByIdAndUpdate({ _id: storeId }, { $inc : { numOfItems: 1 } })
      .then((store) => {
        if (!store) {
          return respondWithInputError(res, "Can't resolve Store for new Item");
        } else {
          return newStoreItem.save()
            .then((newStoreItem) => {
              return res.status(200).json({
                responseMsg: "New StoreItem created",
                newStoreItem: newStoreItem
              });
            })
            .catch((err) => {
              console.error(err)
              return respondWithDBError(res, err);
            });
        }
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      })
    
  }

  edit (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response> {
    const { _id } = req.params;
    const { name, description, details, price, images : storeItemImages, categories = [] }: StoreItemParams = req.body;
    const storeId = req.body.storeId as unknown as Types.ObjectId;
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
          storeId: storeId,
          name: name,
          description: description,
          details: details,
          price: price as number,
          images: [ ...updatedStoreItemImgs ],
          categories: [ ...categories ],
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

  delete (req: Request, res: Response<IGenericStoreImgRes>): Promise<Response> {
   const { _id } = req.params;

   let deletedImages: number; let deletedItem: IStoreItem;
   const storeItemImagePaths: string[] = [];
   const storeItemImageIds: string[] = [];
   const deleteStoreImgPromises: Promise<boolean>[] = [];

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
          deleteStoreImgPromises.push(deleteFile(path));
        }
        return Promise.all(deleteStoreImgPromises)
          .then(() => {
            return StoreItemImage.deleteMany({ _id: { $in: [ ...storeItemImageIds ] } })
              .then(({ n }) => {
                n ? deletedImages = n : 0;
                return StoreItem.findOneAndDelete({ _id: _id });
              })
              .then((storeItem) => {
                if (storeItem) {
                  const storeId = storeItem.storeId;
                  deletedItem = storeItem;
                  return Store.findByIdAndUpdate({ _id: storeId }, { $inc: { numOfItems: -1 } })
                    .then((store) => {
                      return res.status(200).json({
                        responseMsg: "Deleted the Store Item and " + deletedImages,
                        deletedStoreItem: deletedItem
                      });
                    })
                    .catch((error) => {
                      return respondWithDBError(res, error);
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