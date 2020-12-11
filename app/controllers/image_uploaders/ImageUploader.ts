import multer, { MulterError } from "multer";
import PATH from "path";
import fs from "fs";
import { IImageUploadDetails } from "./types/types";
import { Request, Response, NextFunction } from "express";
import { camelToSnake } from "../helpers/controllerHelpers";
import { IAdministrator } from "../../models/Administrator";
import { pathToFileURL } from "url";


class ImageUploader {
  private uploadDetails: IImageUploadDetails;
  private maxFileSize: number;
  private fileName = "";
  private imageSubDirectory = "";
  private businessAccountId = "";
  private modelId: string = "";
  private imagePath: string;
  private modelName: string;
  private uploader: any;
  /**
   * 
   * @param fieldName - Name of file field, camel case
   * @param modelName - Name of database Model
   * @param maxFileSize - Max file size allowed in megabytes
   */
  constructor(fieldName: string, modelName: string, maxFileSize: number, path?: string) {
    this.modelName = modelName;
    this.maxFileSize = maxFileSize * 1024 * 1024;
    this.uploadDetails = { responseMsg: "", success: false, imagePath: "", fileName: "", absolutePath: "", url: "" };
    this.imageSubDirectory = camelToSnake(fieldName) + "s";
    this.imagePath = path ? this.setPath(path) : this.setPath("public", "uploads", this.imageSubDirectory);
    // multer uploader setup //
    this.uploader = multer({
      limits: {
        fileSize: this.maxFileSize
      },
      storage: this.storage(),
      fileFilter: this.fileFilter
    }).single(fieldName);

    this.runUpload = this.runUpload.bind(this);
    // console.log("initialized");
    // console.log("path is" + this.path)
    // console.log("image path is " + this.imagePath)
  }
  private setPath (...path: string[]): string {
    return PATH.join(PATH.resolve(), ...path);
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
    // these are subdirectories of each image //
    // images for models should be stored in the following manner //
    // /public/uploads/<this.imageSubdirectory>/<businessAccountId>/<modelId>/
    this.businessAccountId = String((req.user as IAdministrator).businessAccountId)
    this.modelId = req.params.storeId || req.params.productId || req.params.storeItemId || req.params.serviceId;
    // throw error if cant resolve either business account id or model id .
    if (!this.businessAccountId || !this.modelId) next(new Error("Cannot resolve a model to which upload image"));
    // final absolute path of image //
    this.imagePath = PATH.join(this.imagePath, this.businessAccountId, this.modelId);
    fs.access(this.imagePath, (err) => {
      if (err && err.code === "ENOENT") {
        console.log("\tMaking directory");
        fs.mkdir(this.imagePath, { recursive : true }, (err) => {
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
        done(null, this.imagePath);
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
            url: "",
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
            url: "",
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
            url: "",
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
          url: PATH.join("/" + "uploads", this.imageSubDirectory, this.businessAccountId, this.modelId, this.fileName),
          absolutePath: this.imagePath + "/" + this.fileName
         };
        res.locals.uploadDetails = this.uploadDetails;
        next();
      }
    });
  }       
}

export default ImageUploader;