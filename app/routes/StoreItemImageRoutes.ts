import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import { IGenericImgUploadCtrl } from "../controllers/helpers/controllerInterfaces";
import ImageUploader from "../controllers/image_uploaders/ImageUploader";

class StoreItemImageRoutes extends RouteConstructor<IGenericImgUploadCtrl, ImageUploader> {
  private uploadStoreItemImg = "/api/uploads/store_item_images/:_store_item_id";
  private deleteStoreItemImg = "/api/uploads/store_item_images/:_id/:_store_item_id";

  constructor(router: Router, controller: IGenericImgUploadCtrl, uploader: ImageUploader) {
    super(router, controller, uploader);
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.uploadStoreItemImgRoute();
    this.deleteStoreItemImgRoute();
  }
  private uploadStoreItemImgRoute (): void {
    this.Router.route(this.uploadStoreItemImg).post(this.uploader!.runUpload, this.controller.createImage);
  }
  private deleteStoreItemImgRoute (): void {
    this.Router.route(this.deleteStoreItemImg).delete(this.controller.deleteImage);
  }
}

export default StoreItemImageRoutes;