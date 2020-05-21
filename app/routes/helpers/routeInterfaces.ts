import { Router } from "express";
import { IGenericImgUploadCtrl, IGenericController} from "../../controllers/helpers/controllerInterfaces";

export abstract class RouteConstructor<T> {
  protected Router: Router;
  protected controller: T;
  constructor(Router: Router, controller: T) {
    this.Router = Router;
    this.controller = controller;
  }
  protected abstract initializeRoutes (): void;
}

