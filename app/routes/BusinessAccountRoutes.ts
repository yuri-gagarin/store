import { Router } from "express";
import BusinessAccountsController from "../controllers/business_accounts/BusinessAccountsController";
import { RouteConstructor } from "./helpers/routeInterfaces";

class BusinessAccountRoutes extends RouteConstructor<BusinessAccountsController> {
  private getAllBusAccountsRoute = "/api/business_accounts";
  private getOneBusAccountRoute = "/api/business_accounts/:accountId";
  private createBusAccountRoute = "/api/business_accounts/create";
  private editBusAccountRoute = "/api/business_accounts/edit";
  private deleteBusAccountRoute = "/api/business_accounts/delete/:busAccountId";

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
    this.Router.route(this.getAllBusAccountsRoute).get(this.controller.getMany);
  }
  private getOneBusAccount(): void {
    this.Router.route(this.getOneBusAccountRoute).get(this.controller.getOne);
  }
  private createBusAccount(): void {
    this.Router.route(this.createBusAccountRoute).post(this.controller.create);
  }
  private editBusAccount(): void {
    this.Router.route(this.editBusAccountRoute).patch(this.controller.edit);
  }
  private deleteBusAccount(): void {
    this.Router.route(this.deleteBusAccountRoute).delete(this.controller.delete);
  }
};

export default BusinessAccountRoutes;