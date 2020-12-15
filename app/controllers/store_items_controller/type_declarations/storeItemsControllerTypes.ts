import { IStoreItem } from "../../../models/StoreItem";
// expected StoreItemData from a form //
export type StoreItemData = {
  storeId?: string;
  storeName?: string;
  name?: string;
  description?: string;
  details?: string;
  price?: string | number;
  categories?: string[];
  images?: string[];
};
// expected StoreItemsController generic response //
export interface IGenericStoreImgRes {
  responseMsg: string;
  numberOfItems?: number;
  newStoreItem?: IStoreItem;
  editedStoreItem?: IStoreItem;
  deletedStoreItem?: IStoreItem;
  storeItem?: IStoreItem;
  storeItems?: IStoreItem[];
  error?: Error;
  errorMessages?: string[];
};
// expected detailed query params for <getMany> action of the StoreItemsController //
export type StoreItemQueryPar = {
  storeName?: string;
  storeId?: string;
  limit?: string;
  date?: string;
  price?: string;
  name?: string;
};