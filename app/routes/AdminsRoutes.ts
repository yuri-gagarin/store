import passport from "passport";
import AdminsController from "../controllers/admins_controller/AdminsController";
import { RouteConstructor } from "./helpers/routeInterfaces";

import  { Router } from "express";

class AdminRoutes extends RouteConstructor<AdminsController> {
  private registerAdminRoute = "/api/admins/register";
  private updateAdminRoute = "/api/admins/update/:adminId";
  private deleteAdminRoute = "/api/admins/delete/:adminId";
  private loginAdminRoute = "/api/admins/login";
  private logoutAdminRoute = "/api/admins/logout"

  constructor(router: Router, controller: AdminsController) {
    super(router, controller)
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.registerAdmin();
    this.updateAdmin();
    this.deleteAdmin();
    this.deleteAdmin();
    this.loginAdmin();
    this.logoutAdmin();
  }
  private registerAdmin (): void {
    this.Router.route(this.registerAdminRoute).post(this.controller.register);
  }
  private updateAdmin (): void {
    this.Router.route(this.updateAdminRoute).patch(this.controller.editRegistration);
  }
  private deleteAdmin (): void {
    this.Router.route(this.deleteAdminRoute).delete(passport.authenticate("adminJWT", { session: false }), this.controller.deleteRegistration);
  }
  private loginAdmin (): void {
    this.Router.route(this.loginAdminRoute).post(this.controller.login);
  }
  private logoutAdmin (): void {
    this.Router.route(this.logoutAdminRoute).delete(this.controller.logout);
  }
};

export default AdminRoutes;