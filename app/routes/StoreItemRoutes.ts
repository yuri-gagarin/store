import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

class StoreItemRoutes extends RouteConstructor<IGenericController> {
  private viewAllStoreItemsRoute = "/api/store_items";
  private viewStoreItemRoute = "/api/store_items/:_id";
  private createStoreItemRoute = "/api/store_items/create";
  private editStoreItemRoute = "/api/store_items/update/:_id";
  private deleteStoreItemRoute = "/api/store_items/delete/:_id";
  
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
    this.Router.route(this.viewAllStoreItemsRoute).get(this.controller.getMany);
  }
  private getStoreItem (): void {
    this.Router.route(this.viewStoreItemRoute).get(this.controller.getOne);
  }
  private createStoreItem (): void {
    this.Router.route(this.createStoreItemRoute).post(this.controller.create);
  }
  private editStoreItem (): void {
    this.Router.route(this.editStoreItemRoute).patch(this.controller.edit);
  }
  private deleteStoreItem (): void {
    this.Router.route(this.deleteStoreItemRoute).delete(this.controller.delete);
  }
}

export default StoreItemRoutes;