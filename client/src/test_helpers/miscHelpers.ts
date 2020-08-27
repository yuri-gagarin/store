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
      error: null
    },
    storeItemState: {
      responseMsg: "",
      loading: false,
      currentStoreItemData: emptyStoreItemData(),
      numberOfItems: 0,
      loadedStoreItems: [],
      error: null
    },
    productState: {
      responseMsg: "",
      loading: false,
      currentProductData: emptyProductData(),
      loadedProducts: [],
      error: null
    },
    serviceState: {
      responseMsg: "",
      loading: false,
      currentServiceData: emptyServiceData(),
      loadedServices: [],
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