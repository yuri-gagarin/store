import { Request, Response } from "express";

export interface IGenericController {
  index?(req: Request, res: Response): Promise<Response>;
  get(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  edit(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}
export interface  IGenericImgUploadCtrl {
  createImage(req: Request, res: Response): Promise<Response>;
  deleteImage(req: Request, res: Response): Promise<Response>;
}