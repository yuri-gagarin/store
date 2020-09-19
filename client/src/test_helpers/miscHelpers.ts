import { IGlobalAppState } from "../state/Store";
import { emptyStoreData } from "../state/reducers/storeReducer";
import { emptyStoreItemData } from "../state/reducers/storeItemReducer";
import { emptyProductData } from "../state/reducers/productReducer";
import { emptyServiceData } from "../state/reducers/serviceReducer";
import { emptyBonusVideoData } from "../state/reducers/bonusVideoReducer";

export const generateCleanState = (): IGlobalAppState => {
  return {
    storeState: {
      responseMsg: "",
      loading: false,
      currentStoreData: emptyStoreData(),
      loadedStores: [],
      storeFormOpen: false,
      error: null
    },
    storeItemState: {
      responseMsg: "",
      loading: false,
      currentStoreItemData: emptyStoreItemData(),
      numberOfItems: 0,
      loadedStoreItems: [],
      storeItemFormOpen: false,
      error: null
    },
    productState: {
      responseMsg: "",
      loading: false,
      currentProductData: emptyProductData(),
      loadedProducts: [],
      productFormOpen: false,
      error: null
    },
    serviceState: {
      responseMsg: "",
      loading: false,
      currentServiceData: emptyServiceData(),
      loadedServices: [],
      serviceFormOpen: false,
      error: null
    },
    bonusVideoState: {
      responseMsg: "",
      loading: false,
      currentBonusVideoData: emptyBonusVideoData(),
      loadedBonusVideos: [],
      error: null
    }
  };
};