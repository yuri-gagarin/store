import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

class StoreRoutes extends RouteConstructor<IGenericController> {
  private viewStoreRoute = "/api/store/";
  // private createStoreRoute: string = "/api/store";
  constructor (router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  private getStore (): void {
    this.Router.route(this.viewStoreRoute).get(this.controller.get);
  }
  protected initializeRoutes (): void {
    this.getStore();
  }
}

export default StoreRoutes;