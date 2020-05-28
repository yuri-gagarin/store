import { Router } from "express";

export abstract class RouteConstructor<C, U = {} > {
  protected Router: Router;
  protected controller: C;
  protected uploader: U | null;
  constructor(Router: Router, controller: C, uploader?: U) {
    this.Router = Router;
    this.controller = controller;
    this.uploader = uploader ? uploader : null;
  }
  protected abstract initializeRoutes (): void;
}

