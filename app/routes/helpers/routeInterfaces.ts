import { Router } from "express";

export abstract class RouteConstructor<T> {
  protected Router: Router;
  protected controller: T;
  constructor(Router: Router, controller: T) {
    this.Router = Router;
    this.controller = controller;
  }
  protected abstract initializeRoutes (): void;
}

