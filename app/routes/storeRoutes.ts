import passport from "passport";
import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/_helpers/controllerInterfaces";
//
import { verifyAdminAndBusinessAccountId, verifyDataModelAccess} from "../custom_middleware/customMiddlewares";

class StoreRoutes extends RouteConstructor<IGenericController> {
  private viewAllStoreRoute = "/api/stores";
  private viewStoreRoute = "/api/stores/:storeId";
  private createStoreRoute = "/api/stores/create";
  private editStoreRoute = "/api/stores/update/:storeId";
  private deleteStoreRoute = "/api/stores/delete/:storeId";
  
  constructor (router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes (): void {
    this.getAllStores();
    this.getStore();
    this.createStore();
    this.editStore();
    this.deleteStore();
  }
  private getAllStores (): void {
    this.Router
      .route(this.viewAllStoreRoute)
      .get(
        [
          passport.authenticate("adminJWT", { session: false }),
          verifyAdminAndBusinessAccountId
        ], 
        this.controller.getMany
      );
  }
  private getStore (): void {
    this.Router
      .route(this.viewStoreRoute)
      .get(
        [ 
          passport.authenticate("adminJWT", { session: false }) ,
          verifyAdminAndBusinessAccountId,
          verifyDataModelAccess
        ], 
        this.controller.getOne
      );
  }
  private createStore (): void {
    this.Router
      .route(this.createStoreRoute)
      .post(
        [ 
          passport.authenticate("adminJWT", { session: false }),
          verifyAdminAndBusinessAccountId
        ],
        this.controller.create
      );
  }
  private editStore (): void {
    this.Router
      .route(this.editStoreRoute)
      .patch(
        [ 
          passport.authenticate("adminJWT", { session: false }),
          verifyAdminAndBusinessAccountId,
          verifyDataModelAccess
        ], 
        this.controller.edit
      );
  }
  private deleteStore (): void {
    this.Router
      .route(this.deleteStoreRoute)
      .delete(
        [ 
          passport.authenticate("adminJWT", { session: false }),
          verifyAdminAndBusinessAccountId,
          verifyDataModelAccess
        ], 
        this.controller.delete
      );
  }

};

export default StoreRoutes;