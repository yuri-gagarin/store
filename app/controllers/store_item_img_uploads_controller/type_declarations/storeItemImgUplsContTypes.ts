import { IStoreItem } from "../../../models/StoreItem";
import { IStoreItemImage} from "../../../models/StoreItemImage";

export type StoreItemImgRes = {
  responseMsg: string;
  newStoreItemImage?: IStoreItemImage;
  deletedStoreItemImage?: IStoreItemImage;
  updatedStoreItem?: IStoreItem;
  error?: Error | Object;
  errorMessages?: string[];
};