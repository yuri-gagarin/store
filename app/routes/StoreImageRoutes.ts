import { Response, Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import { IController } from "../controllers/helpers/controllerInterfaces";
import StoreImageUploader from "../controllers/image_uploaders/StoreImageUploader";

class StoreImageRoutes extends RouteConstructor {
  private middle = new StoreImageUploader;
  private uploadStoreImg = "/api/uploads/store_image";
  private deleteStoreImg = "/ap/uploads/store_image/:_id";

  constructor(router: Router, controller: IController) {
    super(router, controller);
  }
  protected initializeRoutes(): void {

  }
  private uploadStoreImgRoute (): void {
    this.Router.route(this.uploadStoreImg).post(this.middle.upload, this.controller.createImage);
  }
  private deleteStoreImgRoute (): void {
    this.Router.route(this.deleteStoreImg).delete(this.controller.deleteImage);
  }
}

export default StoreImageRoutes;