import faker from "faker";
import { IGlobalAppState } from "../state/Store";
import { emptyProductData } from "../state/reducers/productReducer";
import { resetStoreState } from "./storeHelpers";
import { resetStoreItemState } from "./storeItemHelpers";
import { resetServiceState } from "./serviceHelpers";
import { resetBonusVideoState } from "./bonusVideoHelpers";

export const createMockProducts = (numberOfProducts?: number): IProductData[] => {
  const createdProducts: IProductData[] = [];
  let totalToCreate: number;

  if (!numberOfProducts) {
    totalToCreate = Math.floor(Math.random() * 10);
  } else {
    totalToCreate = numberOfProducts;
  }

  for (let i = 0; i < totalToCreate; i++)  {
    const product: IProductData  = {
      _id: faker.random.alphaNumeric(10),
      name: faker.lorem.word(),
      price: faker.commerce.price(20, 100),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraphs(2),
      createdAt: faker.date.recent().toString(),
      images: []
    };
    createdProducts.push(product);
  }
  return createdProducts;
};

export const createMockProductImage = (productId?: string): IProductImgData => {
  const mockImage: IProductImgData = {
    _id: faker.random.alphaNumeric(10),
    url: faker.internet.url(),
    absolutePath: faker.system.filePath(),
    imagePath: faker.system.directoryPath(),
    fileName: faker.system.fileName(),
    createdAt: faker.date.recent().toString()
  };
  return mockImage;
};

export const clearProductState = (globalState: IGlobalAppState): void => {
  globalState.productState = {
    responseMsg: "",
    loading: false,
    currentProductData: emptyProductData(),
    loadedProducts: [],
    productFormOpen: false,
    error: null
  };
};

export const resetProductState = (): IProductState => {
  return {
    responseMsg: "",
    loading: false,
    currentProductData: emptyProductData(),
    loadedProducts: [],
    productFormOpen: false,
    error: null
  };
};

type SetMockProductStateOpts = {
  currentProduct?: boolean;
  loadedProducts?: number;
  productImages?: number;
}
export const setMockProductState = ( opts: SetMockProductStateOpts): IGlobalAppState => {
  const { currentProduct, loadedProducts, productImages } = opts;
  let _product: IProductData | undefined; const _loadedProducts: IProductData[] = []; const _productImages: IProductImgData[] = [];
  if (currentProduct) {
    _product = {
      _id: faker.random.alphaNumeric(10),
      name: faker.lorem.word(),
      price: faker.commerce.price(),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraph(),
      images: [],
      createdAt: faker.date.recent().toString()
    }
    if (productImages) {
      for (let i = 0; i < productImages; i++) {
        _productImages.push(createMockProductImage(_product._id))
      }
      _product.images = _productImages;
    }
  }

  if (loadedProducts) {
    for (let i = 0; i < loadedProducts; i++) {
      const _product: IProductData = {
        _id: faker.random.alphaNumeric(10),
      name: faker.lorem.word(),
      price: faker.commerce.price(),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraph(),
      images: [],
      createdAt: faker.date.recent().toString()
      };
      _loadedProducts.push(_product)
    }
  }

  return {
    storeState: resetStoreState(),
    storeItemState: resetStoreItemState(),
    productState: {
      responseMsg: "Ok",
      loading: false,
      currentProductData: _product ? _product : emptyProductData(),
      loadedProducts: _loadedProducts,
      productFormOpen: false,
      error: null
    },
    serviceState: resetServiceState(),
    bonusVideoState: resetBonusVideoState()
  };
};

