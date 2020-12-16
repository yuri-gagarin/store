import passport from "passport";
import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import { IGenericImgUploadCtrl } from "../controllers/_helpers/controllerInterfaces";
import ImageUploader from "../controllers/image_uploaders/ImageUploader";
import { checkImgUploadCredentials } from "../custom_middleware/customMiddlewares";

/**
 * NOTES
 * Custom middleware <checkImgUploadCredentials> is required to validate <req.user> and
 * to validate <req.user.businessId> === <store.businessId>.
*/

class StoreImageRoutes extends RouteConstructor<IGenericImgUploadCtrl, ImageUploader> {
  private uploadStoreImg = "/api/uploads/store_images/:storeId";
  private deleteStoreImg = "/api/uploads/store_images/:storeId/:storeImgId";

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
      .route(this.uploadStoreImg)
      .post(
        [ 
          passport.authenticate("adminJWT", { session: false }), 
          checkImgUploadCredentials,
          this.uploader!.runUpload 
        ],
        this.controller.createImage
      );
  }
  private deleteStoreImgRoute (): void {
    this.Router
      .route(this.deleteStoreImg)
      .delete(
        [
          passport.authenticate("adminJWT", { session: false }),
          checkImgUploadCredentials
        ],
        this.controller.deleteImage);
  }
}

export default StoreImageRoutes;