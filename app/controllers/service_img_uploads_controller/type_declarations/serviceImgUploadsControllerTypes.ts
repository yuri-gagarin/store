import { IService } from "../../../models/Service";
import { IServiceImage } from "../../../models/ServiceImage";

export type ServiceImgResponse = {
  responseMsg: string;
  newServiceImage?: IServiceImage;
  deletedServiceImage?: IServiceImage;
  updatedService?: IService;
  error?: Error;
  errorMessages?: string[];
};