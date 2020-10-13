type GetAllProducts = {
  readonly type: "GET_ALL_PRODUCTS";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    loadedProducts: IProductData[];
    error: null | Error;
  };
}
type DispatchProductAPIRequest = {
  readonly type: "DISPATCH_PRODUCT_API_REQUEST",
  readonly payload: {
    loading: boolean;
    error: null;
  }
}
type SetCurrentProduct = {
  readonly type: "SET_CURRENT_PRODUCT";
  payload: {
    currentProductData: IProductData;
  }
}
type ClearCurrentProduct = {
  readonly type: "CLEAR_CURRENT_PRODUCT";
  payload: null;
}
type OpenProductForm = {
  readonly type: "OPEN_PRODUCT_FORM";
  payload: {
    productFormOpen: boolean;
  }
}
type CloseProductForm = {
  readonly type: "CLOSE_PRODUCT_FORM",
  payload: {
    productFormOpen: boolean;
  }
}
type GetProduct = {
  readonly type: "GET_PRODUCT";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    currentProductData: IProductData;
    error: null | Error;
  };
}
type CreateProduct = {
  readonly type: "CREATE_PRODUCT";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    newProduct: IProductData;
    error: null | Error;
  };
} 
type EditProduct = {
  readonly type: "EDIT_PRODUCT";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedProduct: IProductData;
    loadedProducts: IProductData[];
    error: null | Error;
  };
}
type UploadNewProductImg = {
  readonly type: "UPLOAD_NEW_PRODUCT_IMG";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedProduct: IProductData;
    loadedProducts: IProductData[];
    error: null;
  }
}
type DeleteProductImg = {
  readonly type: "DELETE_PRODUCT_IMG";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    editedProduct: IProductData;
    loadedProducts: IProductData[];
    error: null;
  }
}
type UpdateProductImgs = {
  readonly type: "UPDATE_PRODUCT_IMGS";
  readonly payload: {
    editedProduct: IProductData
  }
}
type UpdateLoadedProducts = {
  readonly type: "UPDATE_LOADED_PRODUCTS";
  readonly payload: {
    loadedProducts: IProductData[];
  }
}
type DeleteProduct = {
  readonly type: "DELETE_PRODUCT";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    loadedProducts: IProductData[];
    error: null | Error;
  };
}
type SetProductError = {
  readonly type: "SET_PRODUCT_ERROR";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    error: Error;
  };
}
type ClearProductError = {
  readonly type: "ClEAR_PRODUCT_ERROR";
  readonly payload: {
    loading: boolean;
    responseMsg: string;
    error: null;
  };
}

interface IProductImgData {
  _id: string;
  description?: string;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: string;
  editedAt?: string;
}
interface IProductData {
  _id: string;
  name: string;
  details: string;
  description: string;
  price: string;
  images: IProductImgData[];
  createdAt: string;
  editedAt?: string;
}
interface IProductState {
  loading: boolean;
  responseMsg: string;
  currentProductData: IProductData;
  loadedProducts: IProductData[];
  productFormOpen: boolean;
  error: null | Error;
}
type ProductAction = DispatchProductAPIRequest | GetAllProducts | GetProduct | SetCurrentProduct | ClearCurrentProduct | OpenProductForm | CloseProductForm | CreateProduct | EditProduct | DeleteProduct | SetProductError | ClearProductError | UploadNewProductImg | UpdateProductImgs | DeleteProductImg;