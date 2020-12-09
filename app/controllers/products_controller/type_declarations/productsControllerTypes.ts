import { Types } from "mongoose";
import { IProduct } from "../../../models/Product";

// expected new and updated product data from req.body //
export type ProductData = {
  name: string;
  price: string | number;
  description: string;
  details: string;
  images?: (string[] | Types.ObjectId[]);
};
// ProductsController generic response //
export interface IGenericProdRes {
  responseMsg: string;
  newProduct?: IProduct;
  editedProduct?: IProduct;
  deletedProduct?: IProduct;
  product?: IProduct;
  products?: IProduct[];
};
// ProductsController specified query params //
export type ProducQueryPar = {
  price?: string;
  date?: string;
  name?: string;
  limit?: string;
};