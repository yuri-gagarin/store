import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import { IGenericImgUploadCtrl } from "../controllers/helpers/controllerInterfaces";
import ImageUploader from "../controllers/image_uploaders/ImageUploader";

class StoreImageRoutes extends RouteConstructor<IGenericImgUploadCtrl, ImageUploader> {
  private uploadStoreImg = "/api/uploads/store_images/:_store_id";
  private deleteStoreImg = "/api/uploads/store_images/:_id/:_store_id";

  constructor(router: Router, controller: IGenericImgUploadCtrl, uploader: ImageUploader) {
    super(router, controller, uploader);
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.uploadStoreImgRoute();
    this.deleteStoreImgRoute();
  }
  private uploadStoreImgRoute (): void {
    this.Router.route(this.uploadStoreImg).post(this.uploader!.runUpload, this.controller.createImage);
  }
  private deleteStoreImgRoute (): void {
    this.Router.route(this.deleteStoreImg).delete(this.controller.deleteImage);
  }
}

export default StoreImageRoutes;