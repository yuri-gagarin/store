import { Router } from "express";
import passport from "passport";
import BusinessAccountsController from "../controllers/business_accounts/BusinessAccountsController";
import { RouteConstructor } from "./helpers/routeInterfaces";

class BusinessAccountRoutes extends RouteConstructor<BusinessAccountsController> {
  private getAllBusAccountsRoute = "/api/business_accounts";
  private getOneBusAccountRoute = "/api/business_accounts/:businessAcctId";
  private createBusAccountRoute = "/api/business_accounts/create";
  private editBusAccountRoute = "/api/business_accounts/edit/:businessAcctId";
  private deleteBusAccountRoute = "/api/business_accounts/delete/:businessAcctId";

  constructor(router: Router, controller: BusinessAccountsController) {
    super(router, controller);
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.getAllBusAccounts();
    this.getOneBusAccount();
    this.createBusAccount();
    this.editBusAccount();
    this.deleteBusAccount();
  }

  private getAllBusAccounts(): void {
    this.Router
      .route(this.getAllBusAccountsRoute)
      .get(
        [
          passport.authenticate("adminJWT", { session: false })
        ],
        this.controller.getMany
      );
  }
  private getOneBusAccount(): void {
    this.Router
      .route(this.getOneBusAccountRoute)
      .get(
        [
          passport.authenticate("adminJWT", { session: false })
        ],
        this.controller.getOne
      );
  }
  private createBusAccount(): void {
    this.Router
      .route(this.createBusAccountRoute)
      .post(
        [
          passport.authenticate("adminJWT", { session: false })
        ],
        this.controller.create
      );
  }
  private editBusAccount(): void {
    this.Router
      .route(this.editBusAccountRoute)
      .patch(
        [
          passport.authenticate("adminJWT", { session: false })
        ],
        this.controller.edit
      );
  }
  private deleteBusAccount(): void {
    this.Router
      .route(this.deleteBusAccountRoute)
      .delete(
        [
          passport.authenticate("adminJWT", { session: false })
        ],
        this.controller.delete
      );
  }
};

export default BusinessAccountRoutes;