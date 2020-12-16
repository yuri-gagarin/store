import { Router } from "express";
import passport from "passport";
// models and model interfaces //
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import { IGenericImgUploadCtrl } from "../controllers/_helpers/controllerInterfaces";
import ImageUploader from "../controllers/image_uploaders/ImageUploader";
// custom middleware //
import { checkImgUploadCredentials } from "../custom_middleware/customMiddlewares";

/**
 * NOTES
 * Custom middleware <checkImgUploadCredentials> is required to validate <req.user> and
 * to validate <req.user.businessId> === <storeItem.businessId>.
*/

class StoreItemImageRoutes extends RouteConstructor<IGenericImgUploadCtrl, ImageUploader> {
  private uploadStoreItemImg = "/api/uploads/store_item_images/:storeItemId";
  private deleteStoreItemImg = "/api/uploads/store_item_images/:storeItemId/:storeItemImgId";

  constructor(router: Router, controller: IGenericImgUploadCtrl, uploader: ImageUploader) {
    super(router, controller, uploader);
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.uploadStoreItemImgRoute();
    this.deleteStoreItemImgRoute();
  }
  private uploadStoreItemImgRoute (): void {
    this.Router
      .route(this.uploadStoreItemImg)
      .post(
        [ 
          passport.authenticate("adminJWT", { session: false }),
          checkImgUploadCredentials
        ],
        this.uploader!.runUpload, 
        this.controller.createImage
      );
  }
  private deleteStoreItemImgRoute (): void {
    this.Router
      .route(this.deleteStoreItemImg)
      .delete(
        [
          passport.authenticate("adminJWT", { session: false }),
          checkImgUploadCredentials
        ],
        this.controller.deleteImage
      );
  }
}

export default StoreItemImageRoutes;