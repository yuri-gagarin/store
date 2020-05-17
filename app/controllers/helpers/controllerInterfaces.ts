import { Request, Response } from "express";

export interface IGenericController {
  get(req: Request, res: Response): Promise<Response>;
  create?(req: Request, res: Response): Promise<Response>;
  edit?(req: Request, res: Response): Promise<Response>;
  delete?(req: Request, res: Response): Promise<Response>;
}