import { Router } from "express";
import TestController from "../controllers/TestController";

class TestRoutes {
  private testPath = "/api/test";
  private Router: Router;
  constructor(Router: Router) {
    this.Router = Router;
    this.initializeRoutes()
  }
  private initializeRoutes = () => {
    this.Router.get(this.testPath, new TestController().test)
  }
}

export default TestRoutes;
