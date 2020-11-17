// StoreItem - APIStoreItemActions types //
export interface IStoreItemImgServerResData {
  responseMsg: string;
  newStoreItemImage?: IStoreItemImgData;
  deletedStoreItemImage?: IStoreItemImgData;
  updatedStoreItem: IStoreItemData;
}

export interface IStoreItemImgServerRes {
  data: IStoreItemImgServerResData;
}

export interface IStoreItemServerResData {
  responseMsg: string;
  numberOfItems: string;
  storeItem?: IStoreItemData;
  newStoreItem?: IStoreItemData;
  editedStoreItem?: IStoreItemData;
  deletedStoreItem?: IStoreItemData;
  storeItems?: IStoreItemData[];
}

export interface IStoreItemServerRes {
  data: IStoreItemServerResData
}

export type ClientStoreItemData = {
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  details: string;
  price: string;
  categories: string[];
  images: IStoreItemImgData[]
}

export type StoreItemQueryPar = {
  storeName?: string;
  storeId?: string;
  limit?: string;
  date?: string;
  price?: string;
  name?: string;
}

// StoreItem form and holder types //
export type StoreItemFormState = {
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  details: string;
  price: string;
  categories: string[];
}
export type StoreDropdownData = {
  storeId: string;
  storeName: string;
}
export type StoreItemData = {
  storeId: string,
  storeName: string,
  name: string;
  description: string;
  details: string;
  price: string;
  images: IStoreItemImgData[];
  categories: string[];
}
// StoreItemFormDropdown types //
export type StoreItemFormStoreDropdownData = {
  key: string;
  text: string;
  value: string;
}
export type StoreItemFormStoreDropdownState = {
  dropdownData: StoreItemFormStoreDropdownData[];
  disabled: boolean;
}
// StoreItemsControlls component types //
export type DropdownData = {
  key: string;
  text: string;
  value: string;
}
export type DropdownState = {
  loading: boolean;
  disabled: boolean;
  data: DropdownData[];
}
