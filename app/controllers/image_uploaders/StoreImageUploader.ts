import multer, { MulterError } from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

export type IImageUploadDetails = {
  responseMsg: string;
  success: boolean;
  imagePath: string;
}

class StoreImageUploader {
  private uploadDetails: IImageUploadDetails;
  private maxFileSize = 10000000;
  private fileName: string = "";
  private imagePath: string = "";
  private uploader = multer({
    limits: {
      fileSize: this.maxFileSize
    },
    storage: this.storage(),
    fileFilter: this.fileFilter
  }).single("storeImage");

  constructor() {
    this.uploadDetails = { responseMsg: "", success: false, imagePath: "" };
  }

  private fileFilter (req: Request, file: any, done: any): void {
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
        this.imagePath = path.join(__dirname, "public", "uploads", "store_images");
        done(null, this.imagePath);
      },
      filename: (req, file, done) => {
        const extName = path.extname(file.originalname);
        this.fileName = file.originalname.split(".")[0] + "_" + Date.now() + extName;
        done(null, this.fileName);
      }
    })
  }
  upload (req: Request, res: Response, next: NextFunction) :void {
    this.uploader(req, res, (err: any) => {
      if (err) {
        const error: MulterError = err;
        if (error.code === "LIMIT_FILE_SIZE") {
          this.uploadDetails = { responseMsg: "Internal error", success: false, imagePath: "" };
          res.locals.uploadDetails = this.uploadDetails;
          next(err);
        } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
          this.uploadDetails = { responseMsg: "Unexpected file", success: false, imagePath: "" };
          next(err);
        } else {
          this.uploadDetails = { responseMsg: "Error occured", success: false, imagePath: "" };  
        } 
      } else {
        this.uploadDetails = { responseMsg: "Success", success: true, imagePath: this.imagePath }
      }
    });
  }
}

export default StoreImageUploader;