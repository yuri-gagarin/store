import { Router} from "express";
import passport from "passport";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

class ProductRoutes extends RouteConstructor<IGenericController> {
  private viewAllProductsRoute = "/api/products";
  private viewProductRoute = "/api/products/:_id";
  private createProductRoute = "/api/products/create";
  private editProductRoute = "/api/products/update/:_id";
  private deleteProductRoute = "/api/products/delete/:_id";
  
  constructor (router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes (): void {
    this.getAllProducts();
    this.getProduct();
    this.createProduct();
    this.editProduct();
    this.deleteProduct();
  }
  private getAllProducts (): void {
    this.Router
      .route(this.viewAllProductsRoute)
      .get(passport.authenticate("adminJWT", { session: false }), this.controller.index);
  }
  private getProduct (): void {
    this.Router
      .route(this.viewProductRoute)
      .get(passport.authenticate("adminJWT", { session: false }), this.controller.get);
  }
  private createProduct (): void {
    this.Router
      .route(this.createProductRoute)
      .post(passport.authenticate("adminJWT", { session: false }), this.controller.create);
  }
  private editProduct (): void {
    this.Router
      .route(this.editProductRoute)
      .patch(passport.authenticate("adminJWT", { session: false }), this.controller.edit);
  }
  private deleteProduct (): void {
    this.Router
      .route(this.deleteProductRoute)
      .delete(passport.authenticate("adminJWT", { session: false }), this.controller.delete);
  }
}

export default ProductRoutes;