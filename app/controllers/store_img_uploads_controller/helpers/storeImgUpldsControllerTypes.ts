import { IStore } from "../../../models/Store";
import { IStoreImage } from "../../../models/StoreImage"; 

export type StoreImageResponse = {
  responseMsg: string;
  newStoreImage?: IStoreImage;
  deletedStoreImage?: IStoreImage;
  updatedStore?: IStore;
  error?: Error;
  errorMessages?: string[];
};