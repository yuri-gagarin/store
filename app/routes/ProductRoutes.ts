import { Router} from "express";
import passport from "passport";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/_helpers/controllerInterfaces";
// custom middleware //
import { verifyAdminAndBusinessAccountId, verifyDataModelAccess } from "../custom_middleware/customMiddlewares";

class ProductRoutes extends RouteConstructor<IGenericController> {
  private viewAllProductsRoute = "/api/products";
  private viewProductRoute = "/api/products/:productId";
  private createProductRoute = "/api/products/create";
  private editProductRoute = "/api/products/update/:productId";
  private deleteProductRoute = "/api/products/delete/:productId";
  
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
      .get(
        [
          passport.authenticate("adminJWT", { session: false }),    // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId                           // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
        ],
        this.controller.getMany
      );
  }
  private getProduct (): void {
    this.Router
      .route(this.viewProductRoute)
      .get(
        [
          passport.authenticate("adminJWT", { session: false }),    // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId,                          // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
          verifyDataModelAccess                                     // custom middleware to ensure <req.user.businessAccountId> === <product.businessAccountId> //
        ],
        this.controller.getOne
      );
  }
  private createProduct (): void {
    this.Router
      .route(this.createProductRoute)
      .post(
        [
          passport.authenticate("adminJWT", { session: false }),    // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId,                          // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
        ],
        this.controller.create
      );
  }
  private editProduct (): void {
    this.Router
      .route(this.editProductRoute)
      .patch(
        [
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId,                         // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> //
          verifyDataModelAccess                                    // custom middleware to ensure <req.user.businessAccountId> === <product.businessAccountId> //
        ],
        this.controller.edit)
      ;
  }
  private deleteProduct (): void {
    this.Router
      .route(this.deleteProductRoute)
      .delete(
        [ 
          passport.authenticate("adminJWT", { session: false }),   // passport middleware jwt token authentication //
          verifyAdminAndBusinessAccountId,                         // custom middleware to verify the presence of <req.user> and <req.user.businessAccountId> // 
          verifyDataModelAccess                                    // custom middleware to ensure <req.user.businessAccountId> === <product.businessAccountId> //
        ],
        this.controller.delete
      );
  }
}

export default ProductRoutes;