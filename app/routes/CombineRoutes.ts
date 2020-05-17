import { Router } from "express";
// routes imports //
import TestRoutes from "./TestRoutes";
import TestController from "../controllers/TestController";
import StoreController from "../controllers/StoreController";
import StoreRoutes from "./StoreRoutes";

class CombineRoutes {
  constructor(router: Router) {
    this.combine(router);
  }
  private combine = (Router: Router): void => {
    new TestRoutes(Router, new TestController());
    new StoreRoutes(Router, new StoreController());
  }
}

export default CombineRoutes;