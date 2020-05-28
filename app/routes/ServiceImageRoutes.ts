import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import ImageUploader from "../controllers/image_uploaders/ImageUploader";
import { IGenericImgUploadCtrl } from "../controllers/helpers/controllerInterfaces";

class ServiceImagesRoutes extends RouteConstructor<IGenericImgUploadCtrl, ImageUploader> {
  private uploadServiceImgRoute = "/api/uploads/service_images/:_service_id";
  private deleteServiceImgRoute = "/api/uploads/store_images/:_img_id/:_service_id";

  constructor(router: Router, controller: IGenericImgUploadCtrl, uploader: ImageUploader) {
    super(router, controller, uploader);
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.uploadStoreImgRoute();
    this.deleteStoreImgRoute();
  }
  private uploadStoreImgRoute (): void {
    this.Router.route(this.uploadServiceImgRoute).post([this.uploader!.runUpload], this.controller.createImage);
  }
  private deleteStoreImgRoute (): void {
    this.Router.route(this.deleteServiceImgRoute).delete(this.controller.deleteImage);
  }
}

export default ServiceImagesRoutes;