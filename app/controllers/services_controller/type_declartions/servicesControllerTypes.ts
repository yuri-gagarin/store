import { IService } from "../../../models/Service";

export type ServiceData = {
  name: string;
  description: string;
  price: string | number;
  images?: string[];
};

export type  GenericServiceResponse = {
  responseMsg: string;
  newService?: IService;
  editedService?: IService;
  deletedService?: IService;
  service?: IService;
  services?: IService[];
  error?: Error;
  errorMessages?: string[];
};

export type ServiceQueryPar = {
  price?: string;
  name?: string;
  popularity?: string;
  date?: string;
  limit?: string;
}