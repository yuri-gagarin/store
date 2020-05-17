import { Router } from "express";
import { IGenericController } from "../../controllers/helpers/controllerInterfaces";

export abstract class RouteConstructor {
  protected Router: Router;
  protected controller: IGenericController;
  constructor(Router: Router, controller: IGenericController) {
    this.Router = Router;
    this. controller = controller;
  }
  protected abstract initializeRoutes (): void;
}

