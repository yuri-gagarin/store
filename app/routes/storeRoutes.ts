import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

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
    this.Router.route(this.viewAllStoreRoute).get(this.controller.index!);
  }
  private getStore (): void {
    this.Router.route(this.viewStoreRoute).get(this.controller.get);
  }
  private createStore (): void {
    this.Router.route(this.createStoreRoute).post(this.controller.create);
  }
  private editStore (): void {
    this.Router.route(this.editStoreRoute).patch(this.controller.edit);
  }
  private deleteStore (): void {
    this.Router.route(this.deleteStoreRoute).delete(this.controller.delete);
  }

}

export default StoreRoutes;