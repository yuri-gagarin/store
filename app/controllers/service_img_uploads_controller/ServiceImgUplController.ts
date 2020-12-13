import { Request, Response } from "express";
import { IAdministrator } from "../../models/Administrator";
// models, model interfaces and type //
import Service from "../../models/Service";
import ServiceImage, { IServiceImage } from "../../models/ServiceImage";
import { IGenericImgUploadCtrl } from '../helpers/controllerInterfaces';
import { NotFoundError, processErrorResponse } from "../helpers/errorHandlers";
// additional types and interfaces //
import { IImageUploadDetails } from "../image_uploaders/types/types";
import { ServiceImgResponse } from "./type_declarations/serviceImgUploadsControllerTypes";
// helpers //
import { respondWithInputError, deleteFile } from "../helpers/controllerHelpers";

/**
 * NOTES 
 * When either <createImage> or <deleteImage> action of the 'ServiceImgUploadsController' gets 
 * called, the <passport.authenticate> and <checkImgUploadCredentials> middlewares should have 
 * been run. 
 * The 'ServiceImgUploadsController' assumes the following: 
 * 1: The Admin has been authenticated and logged in 
 * 2: <req.user> as IAdministrator 'object' exists 
 * 3: <req.user.businessAccountId> property exists
 * 4: <req.user.businessAccountId> === <service.businessAccoundId 
 * 
 * VALID RESPONSE should include: 
 * {
 *    responseMsg: string;
 *    newServiceImage: IServiceImage;
 *    updatedService: IService;
 * }
 * 
 * INVALID RESPONSE should include:
 * {
 *    reponseMsg: string;
 *    error: 'object' | Error;
 *    errorMessages: string[];
 * }
 */

class ServiceImgUploadsController implements IGenericImgUploadCtrl {

  createImage (req: Request, res: Response<ServiceImgResponse>): Promise<Response> {
    const { serviceId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;
    const { success, imagePath, fileName, absolutePath, url } = res.locals.uploadDetails as IImageUploadDetails;
    let newImage: IServiceImage;

    if (success) {
      return ServiceImage.create({
        businessAccountId: businessAccountId,
        serviceId: serviceId,
        url: url,
        fileName: fileName,
        imagePath: imagePath,
        absolutePath: absolutePath
      })
      .then((serviceImage) => {
        newImage = serviceImage;
        return (
          Service.findOneAndUpdate(
            { businessAccountId: businessAccountId, _id: serviceId },
            { $push: { images: serviceImage._id } },
            { upsert: true, new: true }
          )
          .populate("images").exec()
        );
      })
      .then((updatedService) => {
        if (updatedService) {
          return res.status(200).json({
            responseMsg: "Store image uploaded",
            newServiceImage: newImage,
            updatedService: updatedService
          });
        } else {
          throw new NotFoundError({
            errMessage: "Queried Service not found",
            messages: [ "Could not find the queried Service to update" ]
          });
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
    } else {
      return respondWithInputError(res, "Image not uploaded", 500);
    }
  }

  deleteImage (req: Request, res: Response<ServiceImgResponse>): Promise<Response> {
    const { serviceImgId, serviceId } = req.params;
    const { businessAccountId } = req.user as IAdministrator;
    let deletedImage: IServiceImage;

    if (!serviceImgId) {
      return respondWithInputError(res, "Not Found", 404, [ "Could not resolve Service Image to delete" ]);
    }
    
    return (
      ServiceImage.findOne(
        { businessAccountId: businessAccountId, _id: serviceImgId }
      ).exec()
    )
    .then((serviceImg) => {
      if (serviceImg) {
        return deleteFile(serviceImg.absolutePath);
      } else {
        throw new NotFoundError({ 
          errMessage: "Coudn't delete Service Image", 
          messages: [ "Requested Service Image was not found in the database" ]
        });
      }
    })
    .then((_) => {
      return ServiceImage.findOneAndDelete({ businessAccountId: businessAccountId, _id: serviceImgId });
    })
    .then((image) => {
      if (image) {
        deletedImage = image;
        return (
          Service.findOneAndUpdate(
            { businessAccountId: businessAccountId, _id: serviceId },
            { $pull: { images: serviceImgId } },
            { new: true }
          )
          .populate("images").exec()
        );
      } else {
        throw new NotFoundError({
          errMessage: "Queried Image not found",
          messages: [ "Could not find queried Image in the database to delete" ]
        });
      }
    })
    .then((updatedService) => {
      if (updatedService) {
        return res.status(200).json({
          responseMsg: "Image deleted",
          deletedServiceImage: deletedImage,
          updatedService: updatedService
        });
      } else {
        throw new NotFoundError({
          errMessage: "Queried Service not found",
          messages: [ "Could not find queried Image in the database to update" ]
        });
      }
      
    })
    .catch((error) => {
      return processErrorResponse(res, error);
    });
  }

  /*
  private parallelQuery (): Promise<boolean> {
    return new Promise((resolve, reject) => {

    })
  }
  */
};

export default ServiceImgUploadsController;