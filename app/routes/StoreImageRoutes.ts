import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import StoreImageUploader from "../controllers/image_uploaders/StoreImageUploader";
import { IGenericImgUploadCtrl } from "../controllers/helpers/controllerInterfaces";

class StoreImageRoutes extends RouteConstructor<IGenericImgUploadCtrl> {
  private middle = new StoreImageUploader();
  private uploadStoreImg = "/api/uploads/store_images/:_store_id";
  private deleteStoreImg = "/api/uploads/store_images/:_id/:_store_id";

  constructor(router: Router, controller: IGenericImgUploadCtrl) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.uploadStoreImgRoute();
    this.deleteStoreImgRoute();
  }
  private uploadStoreImgRoute (): void {
    this.Router.route(this.uploadStoreImg).post(this.middle.upload, this.controller.createImage);
  }
  private deleteStoreImgRoute (): void {
    this.Router.route(this.deleteStoreImg).delete(this.controller.deleteImage);
  }
}

export default StoreImageRoutes;