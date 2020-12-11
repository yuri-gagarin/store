import passport from "passport";
import { checkImgUploadCredentials } from "../custom_middleware/customMiddlewares";
import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import { IGenericImgUploadCtrl } from "../controllers/helpers/controllerInterfaces";
import ImageUploader from "../controllers/image_uploaders/ImageUploader";

class ProductImageRoutes extends RouteConstructor<IGenericImgUploadCtrl, ImageUploader> {
  private uploadProductImg = "/api/uploads/product_images/:productId";
  private deleteProducteImg = "/api/uploads/product_images/:imageId/:productId";

  constructor(router: Router, controller: IGenericImgUploadCtrl, uploader: ImageUploader) {
    super(router, controller, uploader);
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.uploadStoreImgRoute();
    this.deleteStoreImgRoute();
  }
  private uploadStoreImgRoute (): void {
    this.Router
      .route(this.uploadProductImg)
      .post(
        [
          passport.authenticate("adminJWT", { session: false }), // user login authentication //
          checkImgUploadCredentials,                             // custom middleware to ensure correct admin is editing their data //
          this.uploader!.runUpload                               // image uploader ran through multer //
        ],  
        this.controller.createImage
      );
  }
  private deleteStoreImgRoute (): void {
    this.Router
      .route(this.deleteProducteImg)
      .delete(
        [
          passport.authenticate("adminJWT", { session: false }),
          checkImgUploadCredentials,
        ],
        this.controller.deleteImage
      );
  }
}

export default ProductImageRoutes;