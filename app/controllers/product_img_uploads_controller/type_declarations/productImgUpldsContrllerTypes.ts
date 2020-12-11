import { IProduct } from "../../../models/Product";
import { IProductImage } from "../../../models/ProductImage";

export type ProductImgRes = {
  responseMsg: string;
  newProductImage?: IProductImage;
  deletedProductImage?: IProductImage;
  updatedProduct?: IProduct;
  error?: Error;
  errorMessages?: string[];
};