import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Dispatch } from "react";
import { IGlobalAppState } from "../../../../state/Store";

interface IProductImgServerResData {
  responseMsg: string;
  newProductImage?: IProductImgData;
  deletedProductImage?: IProductImgData;
  updatedProduct: IProductData;
}
interface IProductImgServerRes {
  data: IProductImgServerResData;
}

interface IProductServerResData {
  responseMsg: string;
  product?: IProductData;
  newProduct?: IProductData;
  editedProduct?: IProductData;
  deletedProduct?: IProductData;
  products?: IProductData[];
}
interface IProductServerRes {
  data: IProductServerResData
}


export type ClientProductData = {
  name: string;
  description: string;
  price: string;
  images: IProductImgData[]
}

export const getAllProducts = (dispatch: Dispatch<ProductAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/products"
  };
  return axios.request<IProductServerResData, IProductServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const products = data.products!;
      dispatch({ type: "GET_ALL_PRODUCTS", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedProducts: products,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_PRODUCT_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const getProduct = (_id: string, dispatch: Dispatch<ProductAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "get",
    url: "/api/products/" + _id,
  };
  return axios.request<IProductServerResData, IProductServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const product = data.product!;
      dispatch({ type: "GET_PRODUCT", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        currentProductData: product,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_PRODUCT_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const createProduct = (data: ClientProductData, dispatch: Dispatch<ProductAction>): Promise<boolean> => {
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/products/create",
    data: data
  };

  return axios.request<IProductServerResData, IProductServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const newProduct = data.newProduct!
      dispatch({ type: "CREATE_PRODUCT", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        newProduct: newProduct,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_PRODUCT_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const editProduct = (_id: string, data: ClientProductData, dispatch: Dispatch<ProductAction>, state: IGlobalAppState) => {
  const { loadedProducts } = state.productState;
  const requestOptions: AxiosRequestConfig = {
    method: "patch",
    url: "/api/products/update/" + _id,
    data: data
  };
  return axios.request<IProductServerResData, IProductServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const editedProduct = data.editedProduct!;
      const updatedProducts = loadedProducts.map((product) => {
        if (product._id === editedProduct._id) {
          return editedProduct;
        } else {
          return product;
        }
      });
      dispatch({ type: "EDIT_PRODUCT", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        editedProduct: editedProduct,
        loadedProducts: updatedProducts,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_PRODUCT_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
    });
};

export const deleteProduct = (_id: string, dispatch: Dispatch<ProductAction>, state: IGlobalAppState): Promise<boolean> => {
  const { loadedProducts } = state.productState;
  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/products/delete/" + _id,
  };
  return axios.request<IProductServerResData, IProductServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const deletedProduct = data.deletedProduct!;
      const updatedProducts = loadedProducts.filter((product) => {
        return product._id !== deletedProduct._id;
      })

      dispatch({ type: "DELETE_PRODUCT", payload: {
        loading: false,
        responseMsg: data.responseMsg,
        loadedProducts: updatedProducts,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_PRODUCT_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const uploadProductImage = (_id: string, imageFile: FormData, state: IGlobalAppState, dispatch: Dispatch<ProductAction>): Promise<boolean> => {
  const { loadedProducts } = state.productState;
  const requestOptions: AxiosRequestConfig = {
    method: "post",
    url: "/api/uploads/product_images/" + _id,
    data: imageFile
  };

  return axios.request<IProductImgServerResData, IProductImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, updatedProduct } = data;

      const updatedProducts = loadedProducts.map((product) => {
        if (product._id === updatedProduct._id) {
          return updatedProduct;
        } else {
          return product;
        }
      });
      dispatch({ type: "UPLOAD_NEW_PRODUCT_IMG", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedProduct: updatedProduct,
        loadedProducts: updatedProducts,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_PRODUCT_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    });
};

export const deleteProductImage = (imgId: string, state: IGlobalAppState, dispatch: Dispatch<ProductAction>): Promise<boolean> => {
  const { loadedProducts } = state.productState; 
  const { _id: productId } = state.productState.currentProductData;

  const requestOptions: AxiosRequestConfig = {
    method: "delete",
    url: "/api/uploads/product_images/" + imgId + "/" + productId
  };

  return axios.request<IProductImgServerResData, IProductImgServerRes>(requestOptions)
    .then((response) => {
      const { data } = response;
      const { responseMsg, deletedProductImage, updatedProduct } = data;
      
     
      const updatedProducts = loadedProducts.map((product) => {
        if (product._id === updatedProduct._id) {
          return updatedProduct;
        } else {
          return product;
        }
      });
      dispatch({ type: "DELETE_PRODUCT_IMG", payload: {
        loading: false,
        responseMsg: responseMsg,
        editedProduct: updatedProduct,
        loadedProducts: updatedProducts,
        error: null
      }});
      return true;
    })
    .catch((error: AxiosError) => {
      dispatch({ type: "SET_PRODUCT_ERROR", payload: {
        loading: false,
        responseMsg: error.message,
        error: error
      }});
      return false;
    })
};


