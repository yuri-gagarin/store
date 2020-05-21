import { Router } from "express";
import { IController} from "../../controllers/helpers/controllerInterfaces";

export abstract class RouteConstructor {
  protected Router: Router;
  protected controller: IController;
  constructor(Router: Router, controller: IController) {
    this.Router = Router;
    this. controller = controller;
  }
  protected abstract initializeRoutes (): void;
}

