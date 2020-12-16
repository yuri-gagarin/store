import passport from "passport";
import { Router } from "express";
// model, controller, types and interfaces //
import { RouteConstructor } from "./helpers/routeInterfaces"; 
import { IGenericImgUploadCtrl } from "../controllers/_helpers/controllerInterfaces";
// image uploader //
import ImageUploader from "../controllers/image_uploaders/ImageUploader";
// additional custom middleware //
import { checkImgUploadCredentials } from "../custom_middleware/customMiddlewares";

/**
 * NOTES
 * Custom middleware <checkImgUploadCredentials> is required to validate <req.user> and
 * to validate <req.user.businessId> === <service.businessId>.
*/

class ServiceImagesRoutes extends RouteConstructor<IGenericImgUploadCtrl, ImageUploader> {
  private uploadServiceImgRoute = "/api/uploads/service_images/:serviceId";
  private deleteServiceImgRoute = "/api/uploads/service_images/:serviceId/:serviceImgId";

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
      .route(this.uploadServiceImgRoute)
      .post(
        [ 
          passport.authenticate("adminJWT", { session: false }),  // user login authentication //
          checkImgUploadCredentials,                              // custom middleware to ensure correct admin is editing their data //
          this.uploader!.runUpload                                // image uploader ran through multer //
        ], 
        this.controller.createImage
      );
  }
  private deleteStoreImgRoute (): void {
    this.Router
      .route(this.deleteServiceImgRoute)
      .delete(
        [
          passport.authenticate("adminJWT", { session: false }),  // user login authentication //
          checkImgUploadCredentials                               // custom middleware to ensure correct admin is editing their data //
        ],
        this.controller.deleteImage
      );
  }
};

export default ServiceImagesRoutes;