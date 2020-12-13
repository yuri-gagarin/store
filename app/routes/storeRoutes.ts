import passport from "passport";
import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/_helpers/controllerInterfaces";

class StoreRoutes extends RouteConstructor<IGenericController> {
  private viewAllStoreRoute = "/api/stores";
  private viewStoreRoute = "/api/stores/:_id";
  private createStoreRoute = "/api/stores/create";
  private editStoreRoute = "/api/stores/update/:_id";
  private deleteStoreRoute = "/api/stores/delete/:_id";
  
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
      .get(passport.authenticate("adminJWT", { session: false }), this.controller.getMany);
  }
  private getStore (): void {
    this.Router
      .route(this.viewStoreRoute)
      .get(passport.authenticate("adminJWT", { session: false }), this.controller.getOne);
  }
  private createStore (): void {
    this.Router
      .route(this.createStoreRoute)
      .post(passport.authenticate("adminJWT", { session: false }), this.controller.create);
  }
  private editStore (): void {
    this.Router
      .route(this.editStoreRoute)
      .patch(passport.authenticate("adminJWT", { session: false }), this.controller.edit);
  }
  private deleteStore (): void {
    this.Router
      .route(this.deleteStoreRoute)
      .delete(passport.authenticate("adminJWT", { session: false }), this.controller.delete);
  }

};

export default StoreRoutes;