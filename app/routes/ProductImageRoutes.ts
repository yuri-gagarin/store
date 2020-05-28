import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import { IGenericImgUploadCtrl } from "../controllers/helpers/controllerInterfaces";
import ImageUploader from "../controllers/image_uploaders/ImageUploader";

class ProductImageRoutes extends RouteConstructor<IGenericImgUploadCtrl, ImageUploader> {
  private uploadProductImg = "/api/uploads/product_images";
  private deleteProducteImg = "/api/uploads/product_images/:_id";

  constructor(router: Router, controller: IGenericImgUploadCtrl, uploader: ImageUploader) {
    super(router, controller, uploader);
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.uploadStoreImgRoute();
    this.deleteStoreImgRoute();
  }
  private uploadStoreImgRoute (): void {
    this.Router.route(this.uploadProductImg).post(this.uploader!.runUpload, this.controller.createImage);
  }
  private deleteStoreImgRoute (): void {
    this.Router.route(this.deleteProducteImg).delete(this.controller.deleteImage);
  }
}

export default ProductImageRoutes;