import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

class ProductRoutes extends RouteConstructor<IGenericController> {
  private viewAllProductsRoute = "/api/products";
  private viewProductRoute = "/api/product/:_id";
  private createProductRoute = "/api/product/create";
  private editProductRoute = "/api/product/update/:_id";
  private deleteProductRoute = "/api/product/delete/:_id";
  
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
    this.Router.route(this.viewAllProductsRoute).get(this.controller.index!);
  }
  private getProduct (): void {
    this.Router.route(this.viewProductRoute).get(this.controller.get);
  }
  private createProduct (): void {
    this.Router.route(this.createProductRoute).post(this.controller.create);
  }
  private editProduct (): void {
    this.Router.route(this.editProductRoute).patch(this.controller.edit);
  }
  private deleteProduct (): void {
    this.Router.route(this.deleteProductRoute).delete(this.controller.delete);
  }
}

export default ProductRoutes;