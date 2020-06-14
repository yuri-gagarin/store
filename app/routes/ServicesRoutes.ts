import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

class ServicesRoutes extends RouteConstructor<IGenericController> {
  private viewAllServicesRoute = "/api/services";
  private viewServiceRoute = "/api/services/:_id";
  private createServiceRoute = "/api/services/create";
  private editServiceRoute = "/api/services/update/:_id";
  private deleteServiceRoute = "/api/services/delete/:_id";
  
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
    this.Router.route(this.viewAllServicesRoute).get(this.controller.index!);
  }
  private getService (): void {
    this.Router.route(this.viewServiceRoute).get(this.controller.get);
  }
  private createService (): void {
    this.Router.route(this.createServiceRoute).post(this.controller.create);
  }
  private editService (): void {
    this.Router.route(this.editServiceRoute).patch(this.controller.edit);
  }
  private deleteService (): void {
    this.Router.route(this.deleteServiceRoute).delete(this.controller.delete);
  }
}

export default ServicesRoutes;