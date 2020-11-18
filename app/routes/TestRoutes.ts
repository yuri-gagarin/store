import { Router } from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";
import passport from "passport";

class TestRoutes extends RouteConstructor<IGenericController> {
  private testPath = "/api/test";
  constructor(router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes = (): void => {
    this.testRoute();
  }
  private testRoute (): void {
    this.Router.route(this.testPath).get(passport.authenticate('jwt', {session: false}), this.controller.get);
  }
}

export default TestRoutes;
