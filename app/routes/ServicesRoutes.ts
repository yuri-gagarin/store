import passport from "passport";
import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";
// custom middleware //
import { verifyAdminAndBusinessAccountId, verifyDataModelAccess } from "../custom_middleware/customMiddlewares";

class ServicesRoutes extends RouteConstructor<IGenericController> {
  private viewAllServicesRoute = "/api/services";
  private viewServiceRoute = "/api/services/:serviceId";
  private createServiceRoute = "/api/services/create";
  private editServiceRoute = "/api/services/update/:serviceId";
  private deleteServiceRoute = "/api/services/delete/:serviceId";
  
  constructor (router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes (): void {
    this.getAllServices();
    this.getService();
    this.createService();
    this.editService();
    this.deleteService();
  }
  private getAllServices (): void {
    this.Router
      .route(this.viewAllServicesRoute)
      .get(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId                          // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
        ],
        this.controller.getMany
      );
  }
  private getService (): void {
    this.Router
      .route(this.viewServiceRoute)
      .get(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId ,                        // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
          verifyDataModelAccess                                    // custom middleware to ensure that <req.user.businessAccountId> === <service.businessAccountId> //
        ],
        this.controller.getOne
      );
  }
  private createService (): void {
    this.Router
      .route(this.createServiceRoute)
      .post(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId                          // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
        ],
        this.controller.create
      );
  }
  private editService (): void {
    this.Router
      .route(this.editServiceRoute)
      .patch(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId,                         // custom middleware to verify the presinse of <req.user> and <req.user.businessAccountId> //
          verifyDataModelAccess                                    // custom middleware to ensure that <req.user.businessAccountId> === <service.businessAccountId> //
        ],
        this.controller.edit
      );
  }
  private deleteService (): void {
    this.Router
      .route(this.deleteServiceRoute)
      .delete(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId,                         // custom middleware to verify the presinse of <req.user> and <req.user.businessAccountId> //
          verifyDataModelAccess                                    // custom middleware to ensure that <req.user.businessAccountId> === <service.businessAccountId> //
        ],
        this.controller.delete
      );
  }
};

export default ServicesRoutes;