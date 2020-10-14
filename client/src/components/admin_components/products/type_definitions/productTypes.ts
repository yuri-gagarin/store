// APIProduct actions types //
export interface IProductImgServerResData {
  responseMsg: string;
  newProductImage?: IProductImgData;
  deletedProductImage?: IProductImgData;
  updatedProduct: IProductData;
}
export interface IProductServerRes {
  data: IProductServerResData
}
export interface IProductImgServerRes {
  data: IProductImgServerResData;
}
export interface IProductServerResData {
  responseMsg: string;
  product?: IProductData;
  newProduct?: IProductData;
  editedProduct?: IProductData;
  deletedProduct?: IProductData;
  products?: IProductData[];
}
export type ClientProductData = {
  name: string;
  description: string;
  price: string;
  images: IProductImgData[]
}
// ProductFormHolder and ProductForm types //
export type ProductData = {
  name: string;
  description: string;
  details: string;
  price: string;
  images: IProductImgData[];
}
export type ProductFormState = {
  name: string;
  description: string;
  details: string;
  price: string;
}