import passport from "passport"
import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/_helpers/controllerInterfaces";
// custom middleware //
import { verifyAdminAndBusinessAccountId, verifyDataModelAccess } from "../custom_middleware/customMiddlewares";

class StoreItemRoutes extends RouteConstructor<IGenericController> {
  private viewAllStoreItemsRoute = "/api/store_items";
  private viewStoreItemRoute = "/api/store_items/:storeItemId";
  private createStoreItemRoute = "/api/store_items/create";
  private editStoreItemRoute = "/api/store_items/update/:storeItemId";
  private deleteStoreItemRoute = "/api/store_items/delete/:storeItemId";
  
  constructor (router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes (): void {
    this.getAllStoreItems();
    this.getStoreItem();
    this.createStoreItem();
    this.editStoreItem();
    this.deleteStoreItem();
  }
  private getAllStoreItems (): void {
    this.Router
      .route(this.viewAllStoreItemsRoute)
      .get(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId                          // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
        ],
        this.controller.getMany
      );
  }
  private getStoreItem (): void {
    this.Router
      .route(this.viewStoreItemRoute)
      .get(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId ,                        // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
          verifyDataModelAccess                                    // custom middleware to ensure that <req.user.businessAccountId> === <storeItem.businessAccountId> //
        ],
        this.controller.getOne

      );
  }
  private createStoreItem (): void {
    this.Router
      .route(this.createStoreItemRoute)
      .post(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId                          // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
        ],
        this.controller.create
      );
  }
  private editStoreItem (): void {
    this.Router
      .route(this.editStoreItemRoute)
      .patch(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId ,                        // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
          verifyDataModelAccess                                    // custom middleware to ensure that <req.user.businessAccountId> === <storeItem.businessAccountId> //
        ],
        this.controller.edit
      );
  }
  private deleteStoreItem (): void {
    this.Router
      .route(this.deleteStoreItemRoute)
      .delete(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId ,                        // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
          verifyDataModelAccess                                    // custom middleware to ensure that <req.user.businessAccountId> === <storeItem.businessAccountId> //
        ],
        this.controller.delete
      );
  }
}

export default StoreItemRoutes;