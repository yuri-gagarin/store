import { Request, Response } from "express";
import { IGenericController } from "./helpers/controllerInterfaces";

class TestController implements IGenericController {
  get (req: Request, res: Response): Promise<Response> {
    return new Promise(() => {
      return res.status(200).json({
        responseMsg: "Test successful"
      });
    });
  }
}

export default TestController;