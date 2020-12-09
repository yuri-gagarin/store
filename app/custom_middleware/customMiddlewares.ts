import { NextFunction, Request, Response } from "express";

export const POSTRequestTrimmer = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "POST") {
    if (Object.keys(req.body).length > 0) {
      for (const [ key, value ] of Object.entries(req.body)) {
        if (typeof value === "string") {
          req.body[key] = (value as string).trim();
        }
      }
    }
  }
  next();
};
