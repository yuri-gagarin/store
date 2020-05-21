import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

class TestRoutes extends RouteConstructor<IGenericController> {
  private testPath = "/api/test";
  constructor(router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes = (): void => {
    console.log("initialized test routes");
    this.testRoute();
  }
  private testRoute (): void {
    this.Router.route(this.testPath).get(this.controller.get);
  }
}

export default TestRoutes;
