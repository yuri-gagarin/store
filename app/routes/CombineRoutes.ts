import { Router } from "express";
// routes imports //
import TestRoutes from "./TestRoutes";
import TestController from "../controllers/TestController";
import StoreController from "../controllers/StoreController";
import StoreRoutes from "./StoreRoutes";
import StoreImageRoutes from "./StoreImageRoutes";
import StoreImageUploadController from "../controllers/StoreImgUplController";
import ProductImageRoutes from "./ProductImageRoutes";
import ProductImageUploadController from "../controllers/ProductImgUplController";
import ServicesController from "../controllers/ServicesController";
import ServicesRoutes from "./ServicesRoutes";

class CombineRoutes {
  constructor(router: Router) {
    this.combine(router);
  }
  private combine = (Router: Router): void => {
    new TestRoutes(Router, new TestController());
    new StoreRoutes(Router, new StoreController());
    new StoreImageRoutes(Router, new StoreImageUploadController());
    new ProductImageRoutes(Router, new ProductImageUploadController());
    new ServicesRoutes(Router, new ServicesController());
  }
}

export default CombineRoutes;