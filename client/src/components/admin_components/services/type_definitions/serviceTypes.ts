// APIServiceActions types //
export interface IServiceImgServerResData {
  responseMsg: string;
  newServiceImage?: IServiceImgData;
  deletedServiceImage?: IServiceImgData;
  updatedService: IServiceData;
}
export interface IServiceImgServerRes {
  data: IServiceImgServerResData;
}
export interface IServiceServerResData {
  responseMsg: string;
  service?: IServiceData;
  newService?: IServiceData;
  editedService?: IServiceData;
  deletedService?: IServiceData;
  services?: IServiceData[];
}
export interface IServiceServerRes {
  data: IServiceServerResData
}
export type ClientServiceData = {
  name: string;
  description: string;
  price: string;
  images: IServiceImgData[]
}
// 