import { Request, Response } from "express";

class TestController {
  test = (req: Request, res: Response): Response => {
    return res.status(200).json({
      responseMsg: "Test successful"
    });
  }
}

export default TestController;