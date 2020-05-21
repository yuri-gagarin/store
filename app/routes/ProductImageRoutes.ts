import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import ProductImageUploader from "../controllers/image_uploaders/ProductImageUploader";
import ProductImageUploadController from "../controllers/ProductImgUplController";

class ProductImageRoutes extends RouteConstructor<ProductImageUploadController> {
  private middle = new ProductImageUploader;
  private uploadStoreImg = "/api/uploads/store_images";
  private deleteStoreImg = "/api/uploads/store_images/:_id";

  constructor(router: Router, controller: ProductImageUploadController) {
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

export default ProductImageRoutes;