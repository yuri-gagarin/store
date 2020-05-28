import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import ImageUploader from "../controllers/image_uploaders/ImageUploader";
import { IGenericImgUploadCtrl } from "../controllers/helpers/controllerInterfaces";

class ServiceImagesRoutes extends RouteConstructor<IGenericImgUploadCtrl> {
  private middle = new ImageUploader("serviceImage", 10);
  private uploadServiceImgRoute = "/api/uploads/service_images/:_service_id";
  private deleteServiceImgRoute = "/api/uploads/store_images/:_img_id/:_service_id";

  constructor(router: Router, controller: IGenericImgUploadCtrl) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.uploadStoreImgRoute();
    this.deleteStoreImgRoute();
  }
  private uploadStoreImgRoute (): void {
    this.Router.route(this.uploadServiceImgRoute).post([this.middle.upload], this.controller.createImage);
  }
  private deleteStoreImgRoute (): void {
    this.Router.route(this.deleteServiceImgRoute).delete(this.controller.deleteImage);
  }
}

export default ServiceImagesRoutes;