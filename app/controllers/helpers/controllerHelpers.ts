import { Response } from "express";
import fs from "fs";

export const respondWithInputError = (res: Response, msg?: string, status?: number): Promise<Response> => {
  return new Promise((resolve) =>{
    return resolve(res.status(status ? status : 400).json({
      responseMsg: msg ? msg : "Seems like an error occured"
    }));
  });
};
export const respondWithDBError = (res: Response, err: Error): Promise<Response> => {
  return new Promise((resolve) => {
    return resolve(res.status(500).json({
      responseMsg: "An Error occured",
      error: err
    }));
  });
};

export const respondWithGeneralError = (res: Response, msg: string, status?: number): Promise<Response> => {
  return new Promise((resolve) => {
    return resolve(res.status(status ? status : 500).json({
      responseMsg: "Error",
      error: new Error(msg ? msg: "General error occured")
    }));
  });
};

export const deleteFile = (filePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

export const normalizeImgUrl = (uploadPath: string): Promise<string> => {
  return new Promise((resolve) => {
    const normaLizedUrl = uploadPath.split("/").slice(1).join("/");
    resolve(normaLizedUrl);
  });
};
