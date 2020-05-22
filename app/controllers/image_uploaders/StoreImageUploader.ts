import multer, { MulterError } from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { IImageUploadDetails } from "./types/types";

class StoreImageUploader {
  private uploadDetails: IImageUploadDetails;
  private maxFileSize = 10000000;
  private fileName = "";
  private imagePath = "";
  public uploader = multer({
    limits: {
      fileSize: this.maxFileSize
    },
    storage: this.storage(),
    fileFilter: this.fileFilter
  }).single("storeImage");

  constructor() {
    this.uploadDetails = { responseMsg: "", success: false, imagePath: "", fileName: "", absolutePath: "" };
    this.upload = this.upload.bind(this);
  }

  private fileFilter (req: Request, file: Express.Multer.File, done: any): void {
    const validTypes = [ ".jpeg", ".jpg", ".gif", ".png" ];
    const fileTypes = /jpeg|jpg|gif|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

    if (mimeType && extName) {
      return done(null, true);
    } else {
      return done(new Error("Allowed file types " + validTypes.join(", ")), false);
    }
  }
  private storage (): multer.StorageEngine {
    return multer.diskStorage({
      destination: (req, file, done) => {
        this.imagePath = path.join("public", "uploads", "store_images");
        done(null, this.imagePath);
      },
      filename: (req, file, done) => {
        const extName = path.extname(file.originalname);
        this.fileName = file.originalname.split(".")[0] + "_" + Date.now() + extName;
        done(null, this.fileName);
      }
    });
  }
  public upload (req: Request, res: Response, next: NextFunction): void {
    this.uploader(req, res, (err: any) => {
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
          return next(err);
        } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
          this.uploadDetails = { 
            responseMsg: "Unexpected file", 
            success: false, 
            imagePath: "",
            fileName: this.fileName,
            absolutePath: ""
           };
          res.locals.uploadDetails = this.uploadDetails;
          return next(err);
        } else {
          this.uploadDetails = { 
            responseMsg: "Error occured", 
            success: false, 
            imagePath: "",
            fileName: this.fileName,
            absolutePath: ""
           };
          res.locals.uploadDetails = this.uploadDetails; 
          return next(err); 
        } 
      } else {
        console.log(72);
        this.uploadDetails = { 
          responseMsg: "Success", 
          success: true, 
          imagePath: this.imagePath,
          fileName: this.fileName,
          absolutePath: this.imagePath + "/" + this.fileName
         };
        res.locals.uploadDetails = this.uploadDetails;
        return next();
      }
    });
  }
}

export default StoreImageUploader;