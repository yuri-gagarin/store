import { Response } from "express";
import fs from "fs";
import path from "path";
import { IStoreItemImage } from "../../models/StoreItemImage";
import { IStore } from "../../models/Store";
import { Document, Error, Model } from "mongoose";
import { IAdministrator } from "../../models/Administrator";
import { IUser } from "../../models/User";
import { ValidationError } from "../helpers/errorHandlers"
export const respondWithInputError = (res: Response, msg: string, status?: number, messages?: string[]): Promise<Response> => {
  return new Promise((resolve) => {
    messages = messages ? messages : [ "Something went wrong "];
    const error  = new ValidationError(msg, messages, status);
    return resolve(res.status(error.statusCode).json({
      responseMsg: "Input error",
      error: error,
      errorMessages: error.errorMessages
    }));
  });
};
export const respondWithDBError = (res: Response, err: Error): Promise<Response> => {
  return new Promise((resolve) => {
    return resolve(res.status(500).json({
      responseMsg: "An Error occured",
      error: err,
      errorMessages: [ err.message ]
    }));
  });
};

export const respondWithGeneralError = (res: Response, msg: string, status?: number): Promise<Response> => {
  return new Promise((resolve) => {
    return resolve(res.status(status ? status : 500).json({
      responseMsg: "Error",
      errorMessage: new Error(msg ? msg: "General error occured")
    }));
  });
};

export const rejectWithGenError = (res: Response, message: string, status?: number): Promise<null> => {
  res.status(status ? status : 500);
  return Promise.reject(new Error(message));
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

export const resolveDirectoryOfImg = (absolutePath: string): string => {
  const pathArr = absolutePath.split("/");
  const pathArrLength = pathArr.length;
  return pathArr.slice(0, pathArrLength - 1).join("/");
};

export type RemoveResponse = {
  success: boolean;
  numberRemoved: number;
  message: string;
}
export const removeDirectoryWithFiles = (directoryPath: string): Promise<RemoveResponse> => {
  // files array and removed number //
  let foundFiles: string[]; 

  const removeFilesInDir = (files: string[]) => {
    const promiseArr: Promise<void>[] = [];
    for (let i = 0; i < files.length;  i++) {
      const filePath = path.join(directoryPath, files[i]);
      promiseArr.push(fs.promises.unlink(filePath));
    }
    return Promise.all(promiseArr);
  };
  
  return new Promise<RemoveResponse>((resolve, reject) => {
    let numberRemoved = 0;
    return fs.promises.readdir(directoryPath)
      .then((files) => {
        // empty directory, remove it //
        if (files.length === 0) {
          return fs.promises.rmdir(directoryPath)
            .then(() => {
              resolve({ 
                success: true, 
                numberRemoved: numberRemoved,
                message: `Removed empty directory ${directoryPath}` 
              });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          return removeFilesInDir(files)
            .then((response) => {
              numberRemoved= response.length;
              return fs.promises.rmdir(directoryPath);
            })
            .then(() => {
              resolve({
                success: true, 
                numberRemoved: numberRemoved,
                message: `Removed directory ${directoryPath}`
              });
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
  });
};

export const resolveStoreItemImgDirectories = (storeItemImages: IStoreItemImage[]): string[] => {
  // return unique ids //
  const storeItemIds = storeItemImages.map((img) => img.storeItemId.toString()).filter((value, index, self) => self.indexOf(value) === index);
  const directoriesToDelete = storeItemIds.map((storeItemId) => {
    return path.join(path.resolve(), "public", "uploads", "store_item_images", storeItemId);
  });
  return directoriesToDelete;
};

export const normalizeImgUrl = (uploadPath: string, fileName: string): Promise<string> => {
  return new Promise((resolve) => {
    const normaLizedUrl = uploadPath.split("/").slice(1).join("/") + "/" + fileName;
    resolve(`/${normaLizedUrl}`);
  });
};

export const camelToSnake = (string: string): string => {
  return string.split(/(?=[A-Z])/).map((item) => item.toLocaleLowerCase()).join("_");
};

export const snakeToCamel = (string: string): string => {
  const arr = string.split("_").map((item, index) => {
    if (index === 0) {
      return item;
    } else {
      return item.charAt(0).toUpperCase() + item.slice(1);
    }
  });
  return arr.join("");
};

type ModelType = IAdministrator | IUser;
type ValidationResponse = {
  valid: boolean;
  errorMessages: string[];
}
export const checkDuplicateEmail = (email: string, mongooseModel: Model<ModelType> ): Promise<ValidationResponse> => {
  return mongooseModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        return {
          valid: false,
          errorMessages: [ "A user with this email already exists" ]
        };
      } else {
        return {
          valid: true,
          errorMessages: []
        };
      }
    })
    .catch((err: Error) => {
      throw err;
    });
}