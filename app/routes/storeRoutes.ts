import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

class StoreRoutes extends RouteConstructor<IGenericController> {
  private viewStoreRoute = "/api/store/";
  private createStoreRoute = "/api/store/create";
  constructor (router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes (): void {
    this.getStore();
    this.createStore();
  }
  private getStore (): void {
    this.Router.route(this.viewStoreRoute).get(this.controller.get);
  }
  private createStore (): void {
    this.Router.route(this.createStoreRoute).post(this.controller.create);
  }

}

export default StoreRoutes;