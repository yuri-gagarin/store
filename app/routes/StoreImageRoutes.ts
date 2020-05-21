import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import StoreImageUploader from "../controllers/image_uploaders/StoreImageUploader";
import StoreImageUploadController from "../controllers/StoreImgUplController";

class StoreImageRoutes extends RouteConstructor<StoreImageUploadController> {
  private middle = new StoreImageUploader;
  private uploadStoreImg = "/api/uploads/store_images";
  private deleteStoreImg = "/api/uploads/store_images/:_id";

  constructor(router: Router, controller: StoreImageUploadController) {
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