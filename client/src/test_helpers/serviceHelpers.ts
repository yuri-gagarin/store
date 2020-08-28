import faker from "faker";
import { IGlobalAppState } from "../state/Store";
import { emptyServiceData } from "../state/reducers/serviceReducer";
import { resetStoreState } from "./storeHelpers";
import { resetStoreItemState } from "./storeItemHelpers";
import { resetProductState } from "./productHelpers";
import { resetBonusVideoState } from "./bonusVideoHelpers";
 
export const createMockServices = (numberOfServices?: number): IServiceData[] => {
  const createdServices: IServiceData[] = [];
  let totalToCreate: number;

  if (!numberOfServices) {
    totalToCreate = Math.floor(Math.random() * 10);
  } else {
    totalToCreate = numberOfServices;
  }

  for (let i = 0; i < totalToCreate; i++)  {
    const service: IServiceData = {
      _id: faker.random.alphaNumeric(10),
      name: faker.lorem.word(),
      price: faker.commerce.price(20, 100),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.recent().toString(),
      images: []
    };
    createdServices.push(service);
  }
  return createdServices;
};

export const createMockServiceImage = (serviceId?: string): IServiceImgData => {
  const mockImage: IServiceImgData = {
    _id: faker.random.alphaNumeric(),
    url: faker.internet.url(),
    absolutePath: faker.system.filePath(),
    imagePath: faker.system.directoryPath(),
    fileName: faker.system.fileName(),
    createdAt: faker.date.recent().toString()
  };
  return mockImage;
};

export const clearServiceState = (globalState: IGlobalAppState): void => {
    globalState.serviceState = { 
      responseMsg: "",
      loading: false,
      currentServiceData: emptyServiceData(),
      loadedServices: [],
      error: null
    };
};

export const resetServiceState = (): IServiceState => {
  return { 
    responseMsg: "",
    loading: false,
    currentServiceData: emptyServiceData(),
    loadedServices: [],
    error: null
  };
};

type SetMockServiceStateOpts = {
  currentService?: boolean;
  loadedServices?: number;
  serviceImages?: number;
}
export const setMockServiceState = ( opts: SetMockServiceStateOpts): IGlobalAppState => {
  const { currentService, loadedServices, serviceImages } = opts;
  let _service: IServiceData | undefined; const _loadedServices: IServiceData[] = []; const _serviceImages: IServiceImgData[] = [];
  if (currentService) {
    _service = {
      _id: faker.random.alphaNumeric(10),
      name: faker.lorem.word(),
      price: faker.commerce.price(),
      description: faker.lorem.paragraph(),
      images: [],
      createdAt: faker.date.recent().toString()
    }
    if (serviceImages) {
      for (let i = 0; i < serviceImages; i++) {
        _serviceImages.push(createMockServiceImage(_service._id))
      }
      _service.images = _serviceImages;
    }
  }

  if (loadedServices) {
    for (let i = 0; i < loadedServices; i++) {
      const _service: IServiceData = {
        _id: faker.random.alphaNumeric(10),
      name: faker.lorem.word(),
      price: faker.commerce.price(),
      description: faker.lorem.paragraph(),
      images: [],
      createdAt: faker.date.recent().toString()
      };
      _loadedServices.push(_service)
    }
  }

  return {
    storeState: resetStoreState(),
    serviceState: {
      responseMsg: "Ok",
      loading: false,
      currentServiceData: _service ? _service : emptyServiceData(),
      loadedServices: _loadedServices,
      error: null
    },
    storeItemState: resetStoreItemState(),
    productState: resetProductState(),
    bonusVideoState: resetBonusVideoState()
  };
};

