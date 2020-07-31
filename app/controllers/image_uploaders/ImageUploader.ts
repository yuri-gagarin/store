import multer, { MulterError } from "multer";
import PATH from "path";
import fs from "fs";
import { IImageUploadDetails } from "./types/types";
import { Request, Response, NextFunction } from "express";
import { camelToSnake } from "../helpers/controllerHelpers";


class ImageUploader {
  private uploadDetails: IImageUploadDetails;
  private maxFileSize: number;
  private fileName = "";
  private imagePath = "";
  private path: string;
  private name: string;
  private modelName: string;
  private uploader: any;
  /**
   * 
   * @param name - Name of file field, camel case
   * @param modelName - Name of database Model
   * @param maxFileSize - Max file size allowed in megabytes
   */
  constructor(name: string, modelName: string, maxFileSize: number, path?: string) {
    this.name = name;
    this.modelName = modelName;
    this.maxFileSize = maxFileSize * 1024 * 1024;
    this.uploadDetails = { responseMsg: "", success: false, imagePath: "", fileName: "", absolutePath: "" };
    this.imagePath = camelToSnake(this.name) + "s";
    this.path = path ? this.setPath(path) : this.setPath("public", "uploads", this.imagePath);
    this.uploader = multer({
      limits: {
        fileSize: this.maxFileSize
      },
      storage: this.storage(),
      fileFilter: this.fileFilter
    }).single(this.name);

    this.runUpload = this.runUpload.bind(this);
    // console.log("initialized");
    // console.log("path is" + this.path)
    // console.log("image path is " + this.imagePath)
  }
  private setPath (...path: string[]): string {
    return PATH.join(...path);
  }

  private fileFilter (req: Request, file: Express.Multer.File, done: any): void {
    const validTypes = [ ".jpeg", ".jpg", ".gif", ".png" ];
    const fileTypes = /jpeg|jpg|gif|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(PATH.extname(file.originalname).toLocaleLowerCase());

    if (mimeType && extName) {
      return done(null, true);
    } else {
      return done(new Error("Allowed file types " + validTypes.join(", ")), false);
    }
  }
  
  public runUpload (req: Request, res: Response, next: NextFunction): void {
    const modelIdParam = "_" + camelToSnake(this.modelName) + "_id";
    console.log(modelIdParam)
    this.path = this.path + "/" + req.params[modelIdParam];
    fs.access(this.path, (err) => {
      if (err && err.code === "ENOENT") {
        console.error(err);
        fs.mkdir(this.path, { recursive : true }, (err) => {
          if (err) {
            console.error(err);
            next(err);
          }
          this.handleMulter(req, res, next);
        });
      } else {
        this.handleMulter(req, res, next);
      }
    });
  }
  private storage (): multer.StorageEngine {
    return multer.diskStorage({
      destination: (req, file, done) => {
        done(null, this.path);
      },
      filename: (req, file, done) => {
        const extName = PATH.extname(file.originalname);
        this.fileName = file.originalname.split(".")[0] + "_" + Date.now() + extName;
        done(null, this.fileName);
      }
    });
  }
  private handleMulter (req: Request, res: Response, next: NextFunction): void {
    return this.uploader(req, res, (err: any) => {
      if (err) {
        const error: MulterError = err;
        console.error(error);
        if (error.code === "LIMIT_FILE_SIZE") {
          this.uploadDetails = { 
            responseMsg: "Internal error", 
            success: false, 
            imagePath: "", 
            fileName: this.fileName,
            absolutePath: ""
          };
          res.locals.uploadDetails = this.uploadDetails;
          next(err);
        } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
          this.uploadDetails = { 
            responseMsg: "Unexpected file", 
            success: false, 
            imagePath: "",
            fileName: this.fileName,
            absolutePath: ""
           };
          res.locals.uploadDetails = this.uploadDetails;
          next(err);
        } else {
          this.uploadDetails = { 
            responseMsg: "Error occured", 
            success: false, 
            imagePath: "",
            fileName: this.fileName,
            absolutePath: ""
           };
          res.locals.uploadDetails = this.uploadDetails; 
          next(err); 
        } 
      } else {
        this.uploadDetails = { 
          responseMsg: "Success", 
          success: true, 
          imagePath: this.imagePath,
          fileName: this.fileName,
          absolutePath: this.path + "/" + this.fileName
         };
        res.locals.uploadDetails = this.uploadDetails;
        next();
      }
    });
  }       
}

export default ImageUploader;