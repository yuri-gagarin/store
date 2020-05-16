import { Request, Response, response } from "express";
import Store from "../models/Store";
import StorePicture from "../models/StorePicture";

type StoreParams = {
  title?: string;
  description?: string;
  storeImages?: [string];
}
class StoreController {
  constructor () {
    console.info("Store controller initialized");
  }
  createStore = (req: Request, res: Response): Promise<Response> => {
    const { title, description, storeImages }: StoreParams = req.body;

    return Store.create({
      title: title,
      description: description,
      images: storeImages ? [ ...storeImages ] : []
    })
    .then((store) => {
      return res.status(200).json({
        responseMsg: "New Store created",
        newStore: {
          ...store
        }
      });
    })
    .catch((error) => {
      return res.status(500).json({
        responseMsg: "Seems like we have a server error",
        error: error
      });
    });
  } 
  editStore = (req: Request, res: Response): Promise<Response> => {
    const { id } = req.body;
    return Store.findOne({ _id: id})
      .then((store) => {
        return res.status(200).json(store);
      })
      .catch((error) => {
        return this.respondWithDBError(res, error);
      });
  }
  /*
  saveStore = (req: Request, res: Response): Promise<Response> => {
  
  }
  */
 deleteStore = (req: Request, res: Response): Promise<Response> => {
   const _id: string | undefined = req.params.id;
   let deletedImages: number;

   if (!_id) {
     return this.respondWithInputError(res, "Can't find store");
   }
   return Store.findOne({ _id: _id})
    .then((store) => {
      // first delete all store images //
      if (store) {
        return StorePicture.deleteMany({ _id: { $in: [ ...store.images ] } })
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
            return this.respondWithDBError(res, error);
          });
      } else {
        return this.respondWithInputError(res, "Can't find store to delete");
      }
      
    });
  }
  private respondWithInputError = (res: Response, msg?: string): Promise<Response> => {
    return new Promise((resolve) =>{
      return resolve(res.status(400).json({
        responseMsg: msg ? msg : "Seems like an error occured"
      }));
    });
  }
  private respondWithDBError = (res: Response, err: Error): Promise<Response> => {
    return new Promise((resolve) => {
      return resolve(res.status(500).json({
        responseMsg: "An Error occured",
        error: err
      }));
    });
  }
}

export default StoreController;