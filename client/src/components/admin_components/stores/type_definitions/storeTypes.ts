export interface IStoreImgServerRes {
  data: IStoreImgServerResData;
}
export interface IStoreImgServerResData {
  responseMsg: string;
  newStoreImage?: IStoreImgData;
  deletedStoreImage?: IStoreImgData;
  updatedStore: IStoreData;
}
export interface IStoreServerResponse {
  data: IStoreServerResData
}
export interface IStoreServerResData {
  responseMsg: string;
  store?: IStoreData;
  newStore?: IStoreData;
  editedStore?: IStoreData;
  deletedStore?: IStoreData;
  stores?: IStoreData[];
}

export type ClientStoreData = {
  title: string;
  description: string;
  images: IStoreImgData[]
}
export type StoreQuery = {
  storeName?: string;
  limit?: string;
}

// StoreFormHolder and StoreForm components //
export type StoreFormState = {
  title: string;
  description: string;
}