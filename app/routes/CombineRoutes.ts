import { Router } from "express";
// routes imports //
import TestRoutes from "./TestRoutes";

class CombineRoutes {
  constructor(router: Router) {
    this.combine(router);
  }
  private combine = (Router: Router): void => {
    new TestRoutes(Router);
  }
}

export default CombineRoutes;