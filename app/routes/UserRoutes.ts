import UsersController from "../controllers/UsersController";
import { RouteConstructor } from "./helpers/routeInterfaces";

import  { Router } from "express";

class UserRoutes extends RouteConstructor<UsersController> {
  private registerUserRoute = "/api/users/register";
  private updateUserRoute = "/api/users/update";
  private deleteUserRoute = "/api/users/delete";
  private loginUserRoute = "/api/users/login";
  private logoutUserRoute = "/api/users/logout"

  constructor(router: Router, controller: UsersController) {
    super(router, controller)
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.registerUser();
    this.updateUser();
    this.deleteUser();
    this.deleteUser();
    this.loginUser();
    this.logoutUser();
  }
  private registerUser (): void {
    this.Router.route(this.registerUserRoute).post(this.controller.register);
  }
  private updateUser (): void {
    this.Router.route(this.updateUserRoute).patch(this.controller.editRegistration);
  }
  private deleteUser (): void {
    this.Router.route(this.deleteUserRoute).delete(this.controller.deleteRegistration);
  }
  private loginUser (): void {
    this.Router.route(this.loginUserRoute).post(this.controller.login);
  }
  private logoutUser (): void {
    this.Router.route(this.logoutUserRoute).delete(this.controller.logout);
  }
};

export default UserRoutes;